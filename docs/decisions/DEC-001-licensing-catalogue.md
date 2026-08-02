# DEC-001 — Catalogue Source & Licensing Basis (BLOCKING)

**Status:** Proposed (ratify via issue — blocks all catalogue/ingest/playback work, Brief §6.5)
**Date:** 2026-08-02

---

## 1. Legal reality (Brief §6.2)

Streaming commercial recordings on demand in the UK requires, non-negotiably:

- **PRS for Music** — performing/communication rights in musical works;
- **MCPS** — mechanical reproduction (making the copies streaming entails);
- **PPL** — recording rights context, plus in practice **direct licences from the recording rights
  holders (labels/distributors)** for on-demand catalogue.

There is no engineering workaround. Imran Khan's commercial recordings ("Amplifier", "Bewafa",
"Ni Nachleh", …) are rights-held commercial catalogue: **this platform must not ingest, host, or
stream those files** without those agreements.

## 2. Options evaluated (Brief §6.3)

| Option | Assessment |
|---|---|
| (a) Provider SDK (Spotify/Apple embeds & SDKs) | Legal and free; playback stays on the provider's licensed infra. But full-track playback requires the *listener's* premium account, and SDK terms prohibit most "elite" features (own player engine, offline, transcoding). Can't be the core. |
| (b) Royalty-free / Creative Commons catalogue | Immediately legal to host and stream (licence-per-track verified at ingest; CC-BY/CC0 preferred; attribution stored as metadata). Full technical freedom — ABR, offline, lossless, AI features. Content is not the famous catalogue. |
| (c) Independent-artist catalogue, direct agreements | Full freedom + real exclusive content; requires a standard distribution agreement (template issue-tracked) and per-track provenance records. Slow to grow; perfect long-term differentiator. |
| (d) Full commercial licensing (PRS/MCPS/PPL + labels) | The only route to hosting famous catalogue. Six-figure minimums, per-stream royalty accounting, label negotiations — not viable for this project's stage. |

## 3. Decision

**Hybrid (b) + (c), with (a) as a presentation layer for the commercial catalogue, and the
architecture kept ready for (d):**

1. **Core streamable catalogue = licensed-clean content**: curated CC/royalty-free tracks (option b)
   plus direct-agreement independent artists (option c). Only content with verified, stored licence
   provenance enters the ingest pipeline. Target: ≥ 500 verified tracks before guest-MVP launch.
2. **Imran Khan's commercial recordings stay as YouTube embeds** (existing site behaviour, preserved):
   playback remains on YouTube's licensed infrastructure — effectively option (a) — presented inside
   the artist page. No file of this catalogue ever touches our storage.
3. **Every track carries a `licence` record** (type, source, proof URI, attribution text, territory,
   expiry) enforced as NOT NULL at the schema level; the admin ingest UI blocks upload without it.

## 4. Why not the alternatives alone

- (a)-only kills the entire §5.3/§5.5 product (no own playback engine → no gapless, offline, EQ, ABR).
- (b)-only gives tech freedom but zero brand connection to the artist the site is about.
- (d) now is financially impossible and would block everything behind negotiations (§6.5 forbids this).

## 5. Architectural consequence (Brief §6.4 — mandatory)

All playback and catalogue access goes through a **`CatalogueProvider` interface**
(`search`, `getTrack`, `getStreamManifest`, `getArtwork`, `licenceInfo`), with implementations:
`OwnedCatalogueProvider` (R2/HLS, options b+c) and `YouTubeEmbedProvider` (option a surfaces).
A future `LicensedProvider` (option d or a licensed aggregator API) slots in **without touching the
player**. The player consumes manifests and metadata only; it never knows the source.

## 6. Compliance hooks

- DMCA/notice-and-takedown flow: admin can unpublish a track instantly; takedown contact in SECURITY.md.
- Attribution rendering wherever CC-BY content plays (now-playing view + track page).
- Licence expiry sweep job flags tracks whose terms lapse.
- UK-GDPR is unaffected by catalogue choice but PII rules (Brief §10) apply to artist agreements storage.
