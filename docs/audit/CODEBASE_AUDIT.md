# Codebase Audit — Dhun (inherited static site)

**Date:** 2026-08-02 · **Auditor:** Claude (project bootstrap) · **Commit:** `e67633b`
**Status:** Complete — this document is the mandatory reference for all architecture decisions (Brief §2.5).

---

## 1. What the site is today

A static fan/promotional website for **Imran Khan**, the Dutch-Pakistani singer-songwriter known as the
"King of Punjabi Urban Music". Four pages of plain HTML, one global stylesheet, one script, no build
step, no framework, no backend of its own. Music is presented exclusively through **YouTube embeds** —
the site performs no audio playback itself. The only interactive feature is a mailing-list sign-up form
that POSTs to a Manchester Metropolitan University coursework API.

## 2. Full inventory

### 2.1 Pages (4)

| File | Route | Purpose | Notes |
|---|---|---|---|
| `index.html` | `/` | Home — navbar + 4-image photo card gallery | `<title>` was the placeholder "Website Navbar" on all four pages; set to "Dhun — …" on 2026-08-06 |
| `site/HTML/about.html` | about | Artist biography (career, "Ni Nachleh", "Amplifier", "Bewafa") | Substantive, accurate copy worth keeping |
| `site/HTML/songs.html` | songs | 4 YouTube embeds (`uuCFRaFWjwY`, `JYodEWUdIso`, `iP872SycxjI`, `qRTG8uF2ES4`) | Playback happens on YouTube's licensed infra |
| `site/HTML/sign-up.html` | sign-up | Mailing-list form (name + email) | Posts to third-party university server |

Navigation is copy-pasted into each page with per-page link variations (no shared component); the nav
"logo" is a text wordmark **IMRAN KHAN** with a red→peach gradient text fill.

### 2.2 Scripts (1)

`site/JavaScript/app.js` (~90 lines):

- Mobile hamburger menu toggle (`.is-active` / `.active` class flips).
- `window.onload` handler that wires the sign-up form and POSTs `{name, email}` to
  `https://mudfoot.doc.stu.mmu.ac.uk/node/api/mailinglist`.
- `gethalloffame()` — dead code fetching a **movies** table from the same coursework API; nothing in any
  page references it or the `#movie-table-body` element it writes to.

**Defects found:**

| # | Defect | Impact |
|---|---|---|
| J1 | `document.getElementById('submit')` is null on 3 of 4 pages → `TypeError` in `window.onload` on every page except sign-up | Console error site-wide |
| J2 | Validation failure path calls `location.onload()` (not a function) and **does not return**, so the fetch fires anyway with invalid data | Broken validation |
| J3 | Regexes are unanchored (`/[a-zA-Z_\s\-]{3,32}/`) — `"!!!abc!!!"` passes | Weak validation |
| J4 | Server response written via `innerHTML` without encoding | XSS sink |
| J5 | `navLogo` queries `#navbar__logo` but the markup id is `navbar-logo` | Dead/null variable |
| J6 | The MMU endpoint is university coursework infrastructure — third party, no agreement, likely dead | Feature is non-functional; PII sent off-site |

### 2.3 Styles (1)

`site/Public/style.css` (~545 lines), one global sheet, no methodology (part-BEM, part ad-hoc):

- **Design language (the valuable part):** dark theme (`#131313` sections, `--darkgray #212329` nav),
  Nunito (Google Fonts CDN), gradient-filled headline text (red `#ff0844 → #ffb199` family), an
  Instagram-style CTA gradient (`#fcb045 → #fd1d1d → #833ab4`), cyan→magenta card gradients, purple
  `#9518fc` hover accent, card hover `scale(1.075)`, 4/2/1-column responsive card grids
  (breakpoints 1300/768px).
- Partial CSS-custom-property usage (`:root` has 8 colour vars; most gradients hard-coded inline).

**Defects found:**

| # | Defect | Impact |
|---|---|---|
| C1 | Sign-up media query targets `.container` but the class is `.container1` → fixed `width: 500px` never collapses | Horizontal overflow below ~500 px (violates Brief §7.5) |
| C2 | Sign-up background hotlinks `https://wallpaperaccess.com/full/6424976.jpg` | Third-party dependency, unknown image licence, slow/unreliable |
| C3 | Fixed-pixel cards (`300×425`) and duplicated `.pic__card`/`.Songs__card` blocks | Not fluid; copy-paste divergence |
| C4 | `font-weight: 15` (invalid value), duplicate `.iframe-container` definitions with conflicting sizes | Dead/contradictory rules |

### 2.4 Assets (9 images, ~257 KB total)

| Asset | Size | Used by |
|---|---|---|
| `image1.jpg` | 6 KB | Home gallery, About portrait |
| `image2.jpg`, `image4.jpg`, `image5.jpg` | 19/33/36 KB | Home gallery |
| `image3.jpg`, `image6.jpg`, `image7.jpg` | 10/36/42 KB | **Unused** |
| `Background_image.jpg` | 30 KB | **Unused** (sign-up uses the hotlinked wallpaper instead) |
| `test_image.jpeg` | 46 KB | **Unused** (name suggests a leftover) |

No favicon, no manifest, no meta description, no Open Graph/social cards, no fonts self-hosted.

### 2.5 Repo/meta layer

- **Community files (good, recent, keep):** `README.md` (auto-generated, badge-heavy),
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (MIT), `CODEOWNERS`,
  issue templates (bug/feature YAML), PR template.
- **GitHub Actions (5):** `ci.yml` plus four README-automation workflows (contributors, project index,
  project structure, tech badges).
- **Committed cruft:** `.DS_Store` ×2, `site/.vscode/settings.json`. **No `.gitignore`.**
- **Naming mismatch (resolved 2026-08-02):** the project is now named **Dhun** — repo renamed from
  `MA1002643/Singer-Website` to `MA1002643/dhun` (old URLs redirect); local folder renamed to `dhun`.
  The in-repo `Singer Website/` directory was renamed to `site/` on 2026-08-06 — the last old-name
  reference in the tree — with paths in all four HTML pages updated to match.

**Defect M1 (CI is broken):** `ci.yml` runs `npm ci` on pull requests, but the repo has **no
`package.json` or lockfile**, so every PR check fails. `npm run lint/test --if-present` are no-ops.

### 2.6 Dependencies

Zero npm packages. Runtime third-party surface: Google Fonts CDN, YouTube embed player,
wallpaperaccess.com hotlink, MMU coursework API. No analytics, no error tracking.

## 3. Keep / Refactor / Replace register

### Keep (build upon — Brief §1 requires brand continuity)

| Item | Reasoning |
|---|---|
| **Brand identity**: IMRAN KHAN gradient wordmark, dark `#131313`/`#212329` surfaces, red-orange gradient headlines, Instagram-gradient CTA, purple hover accent, Nunito | This *is* the design language; it seeds the design-token palette (dark theme first, exactly what a streaming UI wants) |
| **About copy** and artist imagery (`image1/2/4/5`) | Real, accurate editorial content — becomes the flagship Artist page |
| **The 4 official videos** | Remain as YouTube embeds on the artist page — the only legal way to feature this commercial catalogue (see DEC-001) |
| Card-grid layout & hover-scale interaction | Direct ancestor of album/playlist card grids |
| Community/docs infra (templates, CONTRIBUTING, SECURITY, LICENSE, CODEOWNERS) | Already good; needs only link/name fixes |
| Mailing-list *intent* | Becomes account sign-up + followed-artist release notifications |

### Refactor (carry forward, restructured)

| Item | Action |
|---|---|
| Colour/gradient values | Extract into design tokens; kill hard-coded duplicates |
| Navigation | Single shared component; fix per-page link drift |
| Responsive card grids | Rebuild fluid (no fixed 300×425 px) inside the component library |
| Images | Move into an asset pipeline (responsive sizes, AVIF/WebP); delete the 4 unused files |
| README automation workflows | Keep, but repoint at the new structure |

### Replace entirely

| Item | Reasoning |
|---|---|
| Static multi-page HTML architecture | Cannot carry auth, playback, offline, real-time (Brief §3.1) |
| `app.js` | 6 defects incl. an XSS sink and a site-wide TypeError; nothing salvageable |
| MMU mailing-list endpoint | Third-party coursework infra, no agreement, PII off-site (J6) |
| Hotlinked wallpaper background | Unlicensed, unreliable (C2) |
| `ci.yml` | Broken by design against this repo (M1); superseded by real pipeline |
| Absolute `/site/...` URL scheme | Breaks under any sub-path hosting; hostile to tooling. The spaces-in-path half was cleared by the `Singer Website/` → `site/` rename (2026-08-06); the absolute paths remain |

## 4. Immediate stabilisation fixes (pre-migration, keep the site live)

1. Guard the sign-up handler (`if (form) …`) to clear the site-wide TypeError (J1).
2. Fix the `.container1` media query (C1) — restores ≤500 px usability.
3. Replace hotlinked background with the local, unused `Background_image.jpg` (C2).
4. ~~Correct page `<title>`s~~ (done 2026-08-06 — all four set to "Dhun — …"); add meta descriptions and a favicon.
5. Point `ci.yml` at reality (HTML validation) until the toolchain lands (M1).
6. Add `.gitignore`; drop `.DS_Store` from tracking.

These are small, independent, zero-risk changes shipped on the current stack — the site stays live and
improves before any migration begins (Brief §2.4).
