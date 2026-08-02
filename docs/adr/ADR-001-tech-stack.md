# ADR-001 — Tech Stack for the Streaming Platform

**Status:** Proposed (ratify via issue) · **Date:** 2026-08-02
**Inputs:** [CODEBASE_AUDIT.md](../audit/CODEBASE_AUDIT.md) (Brief §2.5), DEC-001 (catalogue), DEC-002 (infra/cost)
**Selection criteria (Brief §3.3):** one shared codebase across web/desktop/mobile; strong typing end to
end; mature ecosystem; realistic running cost; maintainable by a single developer.

---

## 1. Frontend framework & cross-platform strategy

**Decision: TypeScript + React 19 + Vite 7 SPA/PWA, TanStack Router; the same bundle is wrapped by
Tauri 2 (desktop) and Capacitor 7 (mobile) in the later store track.**

One rendering codebase satisfies §4.4 parity by construction: web, installed PWA, desktop shell and
mobile shell all execute the identical app. A client-rendered SPA (not SSR) is deliberate: the app is
behind-a-player interactive, SSR complicates native wrapping (needs static export anyway), and the few
SEO-relevant surfaces (artist/browse pages) get prerendered snapshots at build time.

- *Rejected — Next.js (SSR):* superb for content sites, but SSR/RSC adds a server dependency the
  wrappers can't use; we'd run it in `output: export` mode and lose most of its value while keeping its
  complexity. (Vite dev-loop + prerender covers our SEO need.)
- *Rejected — React Native / Expo:* true native UI, but two render targets (native + web) breaks §7.1
  "identical styling" in practice and doubles the surface a solo dev maintains. Web Audio, WebGL
  visualiser and MSE playback are web-platform features; RN would re-implement them.
- *Rejected — Flutter:* excellent parity, but Dart forfeits the TS end-to-end type sharing and the web
  target's accessibility/SEO story is weak (canvas renderer).
- *Rejected — Electron (desktop):* 150–250 MB installers and high RAM vs Tauri's ~10 MB system-webview
  shells; Tauri 2 also covers mobile if Capacitor ever disappoints.

## 2. Backend language, framework, API style

**Decision: TypeScript on Node.js 22 LTS, Fastify 5, tRPC 11 for the app API + a small versioned REST
(OpenAPI via fastify-zod-openapi) surface for webhooks/admin integrations. Zod 4 validation everywhere.**

tRPC gives compile-time end-to-end types between the shared client and server with zero codegen —
the single-dev criterion decides this. REST remains for anything non-TS (transcoder callbacks, future
partners).

- *Rejected — GraphQL:* schema/resolver/codegen overhead and cache complexity buys flexibility for
  many-client ecosystems we don't have.
- *Rejected — REST-only:* hand-maintained DTO types drift; tRPC removes that class of bug.
- *Rejected — Go/Elixir backends:* strong runtimes, but split the language, kill shared Zod schemas,
  and double the solo-dev context switching.

## 3. Database, cache, search

**Decision: PostgreSQL 17 (Neon serverless) + Drizzle ORM; Redis 7 (Upstash) for cache/queues/pub-sub
(BullMQ); Meilisearch 1.x for typo-tolerant instant search; pgvector for semantic search embeddings.**

Postgres models the relational core (users, catalogue, playlists, follows, history) and its `pgvector`
extension hosts embeddings without a second vector store. Meilisearch gives results-as-you-type with
typo tolerance (§5.4.1) in one small self-hostable binary.

- *Rejected — MongoDB:* the domain is joins all the way down (playlist ↔ track ↔ artist ↔ user).
- *Rejected — Elasticsearch:* operationally heavy for one developer; Meilisearch covers the need at
  1/10th the footprint. *Rejected — Algolia:* excellent but per-record pricing scales badly for a
  catalogue. *Rejected — Prisma:* heavier runtime/cold-start than Drizzle and weaker raw-SQL escape hatch.

## 4. Object storage & CDN

**Decision: Cloudflare R2 for audio/artwork masters + renditions, fronted by Cloudflare CDN; signed
URL issuance at a Cloudflare Worker.**

R2 has **zero egress fees** — the decisive fact for audio streaming economics (DEC-002 §2). S3 +
CloudFront at medium traffic costs an order of magnitude more in egress alone.

- *Rejected — S3+CloudFront:* egress-dominant cost. *Rejected — Backblaze B2 + CDN:* cheap but adds a
  second vendor for marginal savings over R2's zero egress.

## 5. Audio streaming protocol & transcoding

**Decision: HLS with CMAF/fMP4 segments; AAC-LC 96/160/256 kbps ladder + FLAC tier for lossless
(§5.5.7); hls.js on MSE browsers, native HLS on Safari/iOS. Ingest pipeline: FFmpeg 7 workers
(BullMQ queue) → transcode → EBU R128 loudness analysis → waveform peaks JSON → metadata extraction.**

HLS is the only protocol with first-class iOS support (MSE is unavailable to iOS Safari web apps for
this purpose); CMAF keeps one segment set. Adaptive ladder satisfies §5.3.1; loudness data feeds
volume normalisation (§5.3.7); waveform peaks feed §5.5.9.

- *Rejected — MPEG-DASH:* no native iOS playback → dual pipelines. *Rejected — raw progressive MP3/
  range requests:* no adaptive bitrate, poor seek economics, hard to protect. *Rejected — WebRTC
  streaming:* built for conferencing latency, wrong tool for on-demand HTTP-cacheable audio.

## 6. Authentication

**Decision: Better Auth (self-hosted, TypeScript) on our Postgres — email/password, OAuth social
sign-in (Google/Apple), email verification, password reset, TOTP MFA, passkeys later. Sessions via
httpOnly cookies (web) + platform secure storage in wrappers (Keychain/Keystore).**

Self-hosting keeps auth data under UK-GDPR control, costs nothing per-MAU, and lives in the same
type system and database.

- *Rejected — Auth0/Clerk:* per-MAU pricing conflicts with a free guest-heavy product; vendor lock-in
  on the user table. *Rejected — Keycloak:* a Java service to operate solo. *Rejected — Lucia:*
  maintenance-mode upstream.

## 7. Real-time transport

**Decision: WebSockets (native `ws` on Fastify) with Redis pub/sub fan-out — playback sync, device
handoff, collaborative sessions, presence/chat. Client reconnection with resumable session tokens.**

- *Rejected — Pusher/Ably:* per-connection pricing on an always-connected player app. *Rejected —
  WebTransport:* immature Safari support. *Rejected — polling/SSE:* SSE is one-way; sync and sessions
  need bidirectional.

## 8. Hosting, IaC, deployment

**Decision: Static frontend on Cloudflare Pages; API + WebSocket + FFmpeg workers as containers on
Fly.io (LHR region); Neon Postgres; Upstash Redis; Meilisearch container on Fly with a volume.
IaC: Terraform for Cloudflare/Neon/Upstash resources; `fly.toml` per service; GitHub Actions deploys
(preview per PR, promote on main).** Full cost model and budget ceiling: DEC-002.

- *Rejected — all-Vercel:* first-class for the frontend but serverless functions can't hold WebSockets
  or long FFmpeg jobs; would force a second compute platform anyway. *Rejected — AWS (ECS/EKS):*
  power we'd pay for in ops time and egress. *Rejected — a single VPS:* cheapest, but no preview
  environments, manual TLS/scaling, single point of failure.

## 9. Observability, logging, errors

**Decision: OpenTelemetry SDK (traces/metrics) exported to Grafana Cloud free tier; Pino structured
JSON logs (PII-redaction serializers per §10); Sentry for client+server error tracking with
scrubbing enabled; UptimeRobot for external probes.**

- *Rejected — Datadog:* cost. *Rejected — self-hosted ELK:* ops burden. OTel keeps the exporter
  swappable so this choice is reversible.

## 10. Monorepo, quality gates, budgets

pnpm 10 + Turborepo 2; Vitest 3 (unit), Playwright 1.5x (E2E + visual regression), Testing Library;
ESLint 9 flat config + Prettier; Changesets for semver; Renovate + `pnpm audit` + OSV scanner in CI;
size-limit enforcing the **bundle budget: ≤ 200 KB gzipped initial JS** for the web shell (player
core lazy-loaded ≤ 100 KB extra), failing the build when exceeded (§7.9). Lighthouse CI gate ≥ 95.

**Version pinning (Brief §3.4):** all workspace dependencies are pinned exact in `package.json`
(`save-exact=true` in `.npmrc`) with the pnpm lockfile committed; Renovate proposes bumps as PRs that
must pass the same budgets. Baseline pins at adoption time are recorded in each package's manifest
(source of truth) rather than duplicated here.

## Consequences

- One TS type system spans DB schema → API → client → tests; refactors are compiler-checked end to end.
- The store-wrapper track (Stage 8) is additive packaging, not a port.
- Named trade-offs accepted: SPA prerender instead of SSR; self-hosted auth means we own security
  hardening (issue-tracked); Fly containers mean we own base-image patching (Renovate-tracked).
