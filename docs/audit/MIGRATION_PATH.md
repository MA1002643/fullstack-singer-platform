# Migration Path — Static Site → Streaming Platform

**Date:** 2026-08-02 · **Depends on:** [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md), ADR-001, DEC-001, DEC-002
**Principle:** strangler-fig migration. The public site is never down and never regresses; every stage
ships something a visitor can use. No big-bang rewrite (Brief §2.4).

---

## Stage 0 — Stabilise the current site (no architecture change)

Ship the six fixes in audit §4 (JS guard, CSS overflow, hotlink removal, titles/meta, CI honesty,
`.gitignore`). **Exit criteria:** zero console errors on all four pages; no horizontal overflow at
320 px; CI green on a trivial PR. *The old site is now a trustworthy baseline.*

## Stage 1 — Toolchain and parallel shell (old site still primary)

Create the pnpm/Turborepo monorepo (ADR-001 §9) *around* the existing files — the legacy site moves to
`apps/legacy/` **unchanged** and continues to deploy as-is. A new `apps/web` (React + Vite) app is
scaffolded with the design tokens extracted from `style.css`, plus Storybook and the real CI pipeline.
Deployed only to a preview URL. **Exit criteria:** legacy site byte-identical in production; new shell
renders the navbar and home gallery from shared components at the preview URL; visual-regression
snapshots of both.

## Stage 2 — Content parity and cutover of the static pages

Rebuild Home, About, Songs (YouTube embeds preserved), and Sign-up (posting to *our own* API stub that
stores mailing-list intent) in `apps/web`. Verify parity with visual regression + Lighthouse ≥ 95.
**Cutover:** production DNS/hosting flips to `apps/web`; `apps/legacy` stays in-tree, servable as an
instant rollback for one release cycle, then is archived. Old `/Singer Website/...` URLs get redirects.
**Exit criteria:** production runs the new shell with identical content and brand; rollback tested.

## Stage 3 — Backend core + catalogue (invisible to visitors)

Stand up the API service, Postgres schema, object storage/CDN, the **catalogue-provider interface**
(DEC-001 §5 — mandatory abstraction), and the ingest pipeline (transcode → loudness → waveform →
metadata). Seed with the licensed/CC catalogue chosen in DEC-001. The public site is unchanged; admin
ingest works behind auth. **Exit criteria:** a track uploaded via ingest is streamable via signed HLS
URL in a test player on the preview URL.

## Stage 4 — Guest streaming MVP (first product change visitors see)

Player engine (HLS adaptive, gapless, queue), mini-player + now-playing, browse/search over the real
catalogue, guest mode semantics (session-only, save-prompts). The Songs page gains "stream on-site"
for the licensed catalogue alongside the YouTube embeds for the commercial one. **Exit criteria:**
a guest can browse, search, and stream end-to-end on production; time-to-first-audio < 500 ms warm.

## Stage 5 — Accounts, library, sync

Auth (email/password, social, MFA), favourites, playlists, history/resume, guest→account carryover,
real-time sync/handoff, GDPR export/delete. **Exit criteria:** two devices logged into one account
stay in sync; guest upgrade preserves session queue.

## Stage 6 — Installable PWA + offline (satisfies Brief §4.1–4.3 without stores)

Manifest, service worker, install UX, encrypted offline downloads, quota management,
sync-on-reconnect. **Exit criteria:** installable on Windows/macOS/Linux/Android/iOS from the
browser; airplane-mode playback of downloaded tracks.

## Stage 7 — Discovery, elite features, admin CMS

Semantic search, recommendations/mixes, collaborative sessions, visualiser, synced lyrics,
AI playlists, social layer, admin surface with RBAC. Shipped as independent vertical slices —
any one can be delayed without blocking the others.

## Stage 8 — Native store wrappers (separate track, per Brief §4.5)

Tauri desktop shells and Capacitor mobile shells around the *same* web codebase; store review happens
here and only here, after the product is already live cross-platform as a PWA. **Exit criteria:**
parity audit passes — no feature exists on one platform and not another (Brief §4.4).

## Rollback and safety rules

- Every stage deploys behind a preview URL first; production flips are DNS/alias switches, reversible in minutes.
- `apps/legacy` is the standing rollback until Stage 4 proves stable.
- Feature flags gate guest streaming (Stage 4) and accounts (Stage 5) so they can be dark-launched.
- Visual-regression + Lighthouse gates run from Stage 1 onward; a failing gate blocks cutover, not development.
