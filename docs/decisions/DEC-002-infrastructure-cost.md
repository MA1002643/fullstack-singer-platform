# DEC-002 — Infrastructure & Cost Model (BLOCKING)

**Status:** Proposed (ratify via issue — blocks backend build, Brief §8.4) · **Date:** 2026-08-02
**Stack references:** ADR-001 §§3–5, 8.

---

## 1. Platform choices (Brief §8.1)

| Concern | Choice | Plan at launch |
|---|---|---|
| Frontend hosting | Cloudflare Pages | Free tier |
| API / WS / workers | Fly.io (LHR) — 3 small containers (api, ws, worker) | ~$5–7/container/mo |
| Database | Neon Postgres (serverless, scale-to-zero) | Free → Launch $19/mo |
| Cache / queue / pub-sub | Upstash Redis (pay-per-request) | Free → ~$10/mo |
| Search | Meilisearch container on Fly + 10 GB volume | ~$7/mo |
| Object storage | Cloudflare R2 | $0.015/GB-month, **$0 egress** |
| CDN | Cloudflare (in front of Pages + R2) | Free/Pro $20/mo |
| Observability | Grafana Cloud free tier + Sentry dev tier | $0–26/mo |

## 2. Egress: the dominant cost, and how it's bounded (Brief §8.2–8.3)

Audio maths: 160 kbps AAC ≈ **72 MB/hour**. A moderately active listener (20 h/mo) pulls ~1.4 GB/mo;
a heavy one (60 h/mo) ~4.3 GB.

**The strategy is structural, not tuning:** R2's zero-egress pricing means audio delivery cost does
not scale with listening hours — the classic killer line item is eliminated by vendor choice. What
remains bounded by design:

- **Immutable cache keys** — segments/artwork are content-addressed, `Cache-Control: public, max-age=31536000, immutable`; Cloudflare edge cache-hit ratio target ≥ 90 %, so R2 **class-B read
  operations** (the residual per-request cost) stay low.
- **Signed URLs at the edge** (Worker-issued, ≤ 5 min TTL, per-session): protection without breaking
  edge caching (signature in query, cache key normalised).
- Client pre-buffer caps (§5.3.2 configurable) prevent speculative over-fetch.
- Rate limiting + per-session concurrency caps on manifest issuance stop bulk-rip abuse from
  becoming a cost event (also a §10 security control).

## 3. Cost model at three traffic levels

Assumptions: catalogue 1,000 tracks × ~4 min × (3 AAC renditions + FLAC + master) ≈ **65 GB** in R2;
20 listening-hours per monthly active user; 90 % edge cache hit.

| Monthly cost (≈USD) | **Low** 100 MAU | **Medium** 2,000 MAU | **High** 20,000 MAU |
|---|---|---|---|
| Fly compute (api/ws/worker, scaled) | 15 | 40 | 180 |
| Neon Postgres | 0 | 19 | 69 |
| Upstash Redis | 0 | 10 | 60 |
| Meilisearch (Fly) | 7 | 7 | 25 |
| R2 storage + operations | 2 | 6 | 30 |
| Audio egress | **0** | **0** | **0** |
| Cloudflare Pro + Workers paid | 0 | 25 | 30 |
| Observability (Grafana/Sentry) | 0 | 26 | 80 |
| Email (Resend) / misc | 0 | 20 | 60 |
| **Total** | **≈ $25** | **≈ $155** | **≈ $535** |

Equivalent S3+CloudFront egress at the High tier would exceed **$4,900/mo for bandwidth alone**
(20k × 1.4 GB × ~$0.085/GB + origin fees) — the R2 decision is worth ~10× the entire platform bill.

## 4. Budget ceiling (Brief §8.2)

**The system must operate within £120/mo (~$150) up to the Medium tier.** Hard controls: Cloudflare
notifications + Fly spend alerts at 50/80/100 % of ceiling; autoscaling max instance counts pinned;
R2 operation-rate alarms; monthly cost review recorded in the repo. Crossing the ceiling is an
incident, not a surprise invoice: the runbook response is degrade (lower default bitrate, tighten
cache TTL floors, pause non-critical workers) before scale-up is approved.

## 5. Payment data

Any future paid tier uses **Stripe Checkout/Billing** — card data never touches this system
(SAQ-A scope), satisfying the Brief §10 PCI requirement by delegation.

## 6. Review triggers

Re-open this decision if: MAU > 10k sustained; catalogue > 10k tracks; lossless adoption > 30 % of
streams; or any provider repricing changes a line item by > 25 %.
