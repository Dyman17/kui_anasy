Status: draft

# Dark heritage redesign — site-wide (05.11.2026)

Author: ui-designer. Implementer: frontend-engineer, strictly from this brief. Where this brief and `kui-anasy-design` / `FINAL.md` differ on theme, type or shell, this brief wins (owner decisions of 05.11.2026). Labels: **OPEN** = I am unsure or the owner must decide; the engineer must not guess, and uses the stated interim. IDs such as `RESP-02` or `A11Y-06` refer to `FRONTEND_QUALITY_STANDARD.md`; `P0-1`... refer to `FRONTEND_AUDIT.md` §14 (row numbers).

---

## 0. Goal and audience

- **Who:** readers of all ages, many older, many on phones, many arriving by QR at the Kuyshiler alley and the Dina Nurpeisova monument (outdoors, daylight, one hand). Kazakh is the default language; RU/EN secondary.
- **Job of the site:** learn about the heritage of Kazakh küi, zhyrau and song; find a person, a place, a book. The home page job is one decision: enter the küi map, or read about Dina Nurpeisova.
- **Tone, three adjectives:** ceremonial, quiet, documentary. Excludes: playful, salesy, techy.
- **Direction (plain words):** *a concert programme printed on dark green stock with gold foil: serif capitals for ceremony, a plain readable sans for reading, photography doing the atmosphere.*
- **Three principles:**
  1. **Type and photograph decorate; ornament does not.** The only ornament is the left rail, one hairline-and-diamond rule, and one faint numeral. No frames, no textures, no icon orbs.
  2. **One gold-filled control per viewport.** Everything else is outline, text link or hairline. Gold text only on dark (it always is now).
  3. **Caps are for ceremony, mixed case is for reading.** Spaced capitals: wordmark, nav, language, buttons, kickers, hero title, page titles (h1). Sections (h2/h3), body, captions, forms: mixed case.

## 1. The reference screenshot, described precisely

File: `…\scratchpad\design-reference-home.webp` (1420×645 crop, header + hero; scale treated as 1:1 CSS px at about 1420 px viewport — **OPEN**: the owner's real viewport is unknown; all numbers below are *proportions to reproduce*, converted to my own px values in §5–§6).

**Grid.** Left ornament strip, about 22 px wide (1.5% of width), full height, flush to the left edge. Then content with about 138 px margin left and about 136 px right (symmetric, roughly 1120 px of content at 1420). Header content and hero copy share the same left edge (x=162). The hero is a **left copy column** (about 30% of width) plus a **right media area** (dombra at x≈71%, eagle at x≈94%, y≈52%); both sit on one full-bleed photograph. Copy is left-aligned throughout, never centred.

**Header (about 68 px high, full-bleed, solid-looking dark green, slightly lighter than the sky below it).** Left to right: round gold emblem (about 42 px) → wordmark «КҮЙ АНАСЫ» in serif capitals with wide tracking (about 17 px, gold-light) with a two-line tagline under it in small sentence-case serif (about 11 px, parchment-grey, 2 lines: «Қазақ дәстүрлі музыкасының / цифрлық мұра порталы»). Centre: five nav items in serif caps, about 12 px, tracking about 0.12em, parchment colour, gaps about 32 px: ТҰЛҒАЛАР · МУЗЫКАЛЫҚ МҰРА · ЖОБАЛАР · КІТАПХАНА · ҚОР ТУРАЛЫ (no active state is visible). Right: a QR icon (outline, 16 px), then KZ RU EN in serif caps about 12 px, active KZ in gold with a 2 px gold underline about 8 px below, inactive RU/EN dimmer; then a round medallion (about 42 px, ornamental disc with a gold-brown ring, round). No search icon is drawn in the screenshot; the owner has decided search stays (see §6.4).

**Hero, copy column top to bottom** (y at 645 px height): gold emblem 50 px (y 177–225) → kicker «"КҮЙ АНАСЫ" ЖЕКЕ ҚОРЫ» (caps, about 12 px, tracking about 0.2em, gold) → title «КҮЙ АНАСЫ» (serif capitals, cap height about 48 px, i.e. about 60 px font, tracking about 0.1em, gold with a soft bronze shade, a faint glow; width about 370 px) → rule about 300 px long, 1 px gold, a small diamond (about 7 px) centred in a gap → «ДИНА НҰРПЕЙІСОВА · 1861–1955» (caps, about 13 px, tracking about 0.18em, gold-light at about 80%) → lead paragraph, 3 lines, serif sentence case about 15 px, parchment, semi-bold look, line width about 330 px (short measure) → two rectangular buttons 44 px tall, 16 px apart: filled gold «КҮЙ КАРТАСЫНА» (dark text) and dark green «ДИНА ТУРАЛЫ» (parchment text), serif caps about 12 px tracking about 0.14em, square corners (radius ≤ 2 px).

**Hero, right and background.** Sky photograph: teal-green top, bruised-olive middle, a low gold sun at x≈47%, y≈72%, flat dark-olive steppe below the horizon at y≈80%. A dombra, front view, tilted about 20° clockwise (neck leans up and to the right), about 53% of hero height, centred x≈71%. A flying eagle silhouette, small, at the far right. A huge faint outlined numeral «1861» in the bottom right (about 25% of hero height, 1 px gold stroke at about 12% opacity, partially behind the media). The sound-box strip under the dombra (Дыбысты қосу / Төкпе / Шертпе / "1/2" hint) is **not built** (owner decision 4).

**Colour readings mapped to tokens** (eyeballed from the image; engineer must not sample the webp):

| Screenshot element | Approx | Token |
|---|---|---|
| Header bar | green about #1D382B | `--forest` #10291F (solid). **OPEN-1**: the screenshot bar is a touch lighter and may be translucent over the photo; interim solid `--forest`. |
| Left rail background | dark green, gold braid | `--forest-deep` + `/patterns/kazakh-rail-gold.svg` |
| Gold button, emblem, title | #E0B95A to #C9A24D | `--gold` #D7B45F (title: `--gold`, not a gradient) |
| Person line, active lang | pale gold | `--gold-light` #F0D78C |
| Lead, nav text | warm off-white | `--parchment` #F2EBDD |
| Dark button | #2A4034 | `--forest-light` #1D4030 with a 1 px `--gold-dark` border |
| Tagline, inactive lang | grey-green | `--ink-muted` (dark value #A8B8A6) |
| Sky | teal-green → olive → gold | CSS placeholder from palette only (§6.3) |

## 2. Content inventory (what really exists)

- Hero copy (kk/ru/en): owner-supplied in `SteppeHero.jsx` COPY; **no new names, dates or numbers**. The dates 1861–1955 appear in the owner's screenshot.
- Header copy: tagline kk/ru/en in `Header.jsx` HEADER_LABELS.
- Imagery on disk: `dina-monument.jpg`, `dina-monument-full.jpg`, `dina-sculpture-bronze.jpg`, alley photos (`alley-*.jpg`, `kuyshiler-alley.jpg`), stele photos, three book covers, `tolegen-kuanyshev-founder.jpg`, `dombra-real.png`, `kobyz-real.png`, `dombra-player-illustration.png` (provenance unknown, see §9), `steppe-archive-1910.jpg`.
- **Missing (owner will supply):** steppe-sunset photo, eagle, ornament strip image, the generated video of an elder with a dombra. **Not drawn as if present.**
- **Unverified, must stay hidden or neutral** (CLAUDE.md rule 1; audit §11.2): stats «321+», «101/110/110», «150+», ISBN, 512 pages, bus numbers, "Жеке QR-код", the sound box. The redesign gives these items a visual home but the engineer must not render any value that is not already in the CMS/seed and not flagged; the stats band stays **hidden** until `content-guard` clears it (implementation: render only if the CMS block exists, as today; design below applies when it does).

## 3. Review of the draft code already in the branch

| Item | Verdict | Change |
|---|---|---|
| `App.jsx`, `index.html`: dark forced, toggle removed | **Keep.** | Also delete the `data-theme` attribute usage after Phase 1 (§8) so no selector needs `[data-theme="dark"]`; until then keep `data-theme="dark"` on `<html>` so the existing block applies. Make sure the inline script in `index.html` sets it before paint (XPAGE-13). |
| `Header.jsx` structure (links via `hrefFor`, KZ/RU/EN with `aria-pressed`, search, QR, medallion) | **Keep** structure and real `<a>`/`<button>` split. | (a) Wrap in one header with **two rows** at 961–1359 (§5.1): add a `.header-bar` (brand + actions) and keep `nav` as a sibling so CSS can reorder without DOM order change (RESP-07: no `order`; the DOM order is brand, nav, actions; at the 2-row tier use grid areas, see §5.1). (b) Mobile overlay: replace `<button>` rows with `<a href={hrefFor(slug)}>`; drop the 01–06 numerals and the `sectionDescriptions` strings (they contain unverified counts "101 күйші, 110 жырау, 110 әнші", "3 томдық" and fail AIT-10 / INT-01); drop the `МӘЗІР БӘЛІМДЕРІ` caps heading. (c) Translate the Kazakh-only `aria-label`s (search dialog, close, "Негізгі мәзір", "Тіл таңдау" in the overlay, search hints, "Парақша") through `HEADER_LABELS` (A11Y-09). (d) Overlay: focus trap + focus return (A11Y-10). (e) Remove `RiShieldKeyholeLine`, `RiArrowRightLine` from rows (icons only where they replace words, AIT-07). (f) The search hint "101 Күйші" is an unverified count: rename to the canon name without a number. (g) `title="… (/)"` fine. (h) Medallion: replace `RiUser3Line` by the design in §5.4. |
| `PageQrButton.jsx` | **Keep** (lazy import, Esc, outside click, hashchange). | Change: quiet zone `margin: 4` (not 2); the downloaded PNG should be larger than the preview: generate the 180 px preview from `width: 360` and download a second `toDataURL` at `width: 1024` (printable). Popover is `role="dialog"` without `aria-modal` (non-modal popover, acceptable) but needs focus move to the popover heading or close button on open, and a visible Close text/button on touch. Colours: modules `--forest-deep`, light `--parchment` (contrast 14.86:1, scanner-safe). |
| `SteppeHero.jsx` | **Keep** markup and copy, `usePrefersReducedMotion`, video-ready slot. | Changes: (a) the media `<figure>` needs `aria-hidden`/`alt` logic per §6.5 (alt only if informative; it is decorative → `alt=""`, since it is a DRAFT instrument photo; owner decides later). (b) The `1861` span stays `aria-hidden`. (c) Replace `scrollToId` smooth scroll: respects reduced motion already; keep. (d) The two buttons are `<button>` that scroll to anchors on the same page: fine as buttons (they are same-page actions), but they must really move focus (existing code does). (e) `<img … fetchpriority="high">` fine; add `decoding="async"`. (f) Wrap the dombra as in §6.5 so the left view only is shown. (g) The hero background `style` custom property pattern is good; **keep `--hero-photo`** as the plug-in point (§6.3). |
| `HomePage.jsx` | Keep order; restyle sections (§9). | Remove `PiCrownDuotone…PiCompassDuotone` icon use and `✦` bullets (AIT-07, I3 scanner). Leaders and Muragerler redesigned without icons. |
| `HeroImageRotator.jsx` deleted | **Keep deleted** (resolves audit P1-5 for the hero). | Gallery carousel still open, see §9.7. |

## 4. Global system

### 4.1 Theme mechanism

Single dark look. Phase 1 moves the dark token values **into `:root`** and removes the light values, removes `[data-theme]` selectors incrementally (175 overrides; do not mass-delete in one commit, each page phase deletes the overrides of its components). `color-scheme: dark` on `:root`. Remove `body::before` blurred photo mosaic (`background-photo-mosaic*.jpg`), `body::after`, `.shell-cultural-contours`, `backdrop-filter` everywhere (AIT-05).

### 4.2 Tokens

**Colour roles** (all existing values; the dark values become the `:root` values):

| Role | Token | Value | Note |
|---|---|---|---|
| Canvas (page) | `--bg-canvas` | `#0B1C15` (= `--forest-deep`) | **Change** from `#07130E` (off-palette, IDN-01). |
| Band / alt surface | `--forest` | `#10291F` | Section alternation, header, footer. |
| Raised surface (card, panel, modal) | `--bg-surface` = `--forest-light` | `#1D4030` | Set `--bg-surface: var(--forest-light)`; today dark sets `#10291F`. |
| Deep underlay (rail, inputs, popovers) | `--forest-deep` | `#0B1C15` | |
| Ink (body, headings) | `--ink` / `--text-primary` | `#F2EBDD` | |
| Muted ink | `--ink-muted` / `--text-muted` | `#A8B8A6` | |
| Accent text, marks, focus | `--accent-gold` = `--gold` | `#D7B45F` | |
| Highlight text | `--gold-light` | `#F0D78C` | person line, active lang, hover. |
| Hairline (decorative) | `--line` | `rgba(215,180,95,.22)` | Not for control boundaries. |
| Gold hairline | `--border-gold` | `rgba(215,180,95,.45)` | Card edges, rule. |
| Control boundary (≥3:1) | **NEW** `--border-ui` | `#A9853C` (= `--gold-dark`) | Inputs, outline buttons, selected state. `--border-gold` over `--forest-deep` is only 2.8:1 (computed) and fails A11Y-04. |
| Hover surface for dark buttons | `--green` | `#24523E` (exists) | |
| Danger | **OPEN-2** | see below | |

`--gold-dark` is **not** a text colour except on `--forest-deep` (5.13:1); on `--forest` it is 4.49:1 and fails; use it only for borders/rules.

**Legacy aliases** (`--terra`, `--plum`, `--wine`, `--ochre`, `--green`): during migration set them in `:root` to the **dark-block values** that exist today (terra `#D7B45F`, plum `#1D4030`, wine `#D7B45F`, ochre `#F0D78C`). Each page phase must replace each use by a semantic token and not rely on the alias (171 uses). Danger: `--plum` was used as *text* colour in light rules, so any `color: var(--plum)` that survives is invisible (`#1D4030` on dark) — find them with `grep -n "color:\s*var(--plum)"` and replace with `var(--ink)`.

**Danger / error colour, OPEN-2.** The palette has no red. Admin errors and form validation need a state that is not colour alone. Interim: error text in `--gold-light` with a leading text label («Қате:» / «Ошибка:» / "Error:") and a 1 px `--gold-light` border on the field. Recommended for the owner to approve: one token `--danger: #E6A494` (contrast 8.5:1 on `--forest-deep`, 5.5:1 on `--forest-light`, computed), admin and form errors only. It is outside the warm/green hue windows of IDN-02, hence the owner decision.

**Contrast (computed, WCAG 2.x relative luminance; text 4.5:1, large/UI 3:1):**

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `--ink` #F2EBDD | `--forest-deep` #0B1C15 | 14.86 | body on canvas |
| `--ink` | `--forest` #10291F | 13.03 | body on band |
| `--ink` | `--forest-light` #1D4030 | 9.68 | body on card |
| `--ink-muted` #A8B8A6 | deep / forest / light | 8.45 / 7.41 / 5.50 | captions, meta |
| `--gold` #D7B45F | deep / forest / light | 8.88 / 7.79 / 5.79 | kicker, links, title, focus |
| `--gold-light` #F0D78C | deep / forest / light | 12.44 / 10.92 / 8.12 | person line, hover, active |
| `--forest-deep` on `--gold` (button) | | 8.88 | gold button text |
| `--forest-deep` on `--gold-light` (hover) | | 12.44 | gold button hover |
| `--ink` on `--green` #24523E (hover) | | 7.51 | dark button hover |
| `--gold-dark` #A9853C | deep / forest / light | 5.13 / 4.49 / 3.34 | borders and rules only (3:1 UI passes everywhere); text only on deep |
| Hero text on photo | | ≥ 4.5 required | enforced by the scrim in §6.2; verify by sampling (A11Y-05) |

**Type tokens** (see §4.3 for the decision):

```
--font-display: "Playfair Display", Georgia, "Times New Roman", serif;   /* heads, nav, buttons, wordmark, lead */
--font-body: "Medeo Sans", -apple-system, "Segoe UI", sans-serif;        /* reading, UI text, forms, captions */
/* --font-brand, --font-editorial, --font-title, --font-quote, --font-signature,
   --font-stamp, --font-nauryz, --font-stencil, --font-mono, --serif, --sans, --font-playfair:
   alias to --font-display or --font-body in Phase 1, delete when unused. */
```

Scale (new, from the quality standard with a nav step added; px at ≥961 / ≤960):

| Token | ≥961 | ≤960 | Family | Case, tracking | Use |
|---|---|---|---|---|---|
| `--text-caption` | 14 | 14 | body | sentence | captions, credits, meta (line-height 1.5) |
| `--text-ui` | 16 | 16 | body | sentence | forms, search, filters (≥16 so iOS does not zoom) |
| `--text-nav` | 14 | 15 | display | caps, 0.1em | nav, lang, buttons (line-height 1.2) |
| `--text-body` | 18 | 17 | body 400 | sentence | reading; line-height 1.7; measure `max-width: 36em` (≈62 Kazakh characters) |
| `--text-lead` | 22 | 19 | display 400 | sentence | hero lead and page lead; 1.55 |
| `--text-h3` | 26 | 22 | display | sentence | card/person titles; 1.25 |
| `--text-h2` | clamp(28px,3.2vw,40px) | 28 | display | sentence | section titles; 1.2 |
| `--text-h1` | clamp(30px,4.2vw,56px) | 30 | display | caps, 0.08em | page-banner title; 1.15 |
| `--text-hero` | clamp(34px,4.4vw,72px) | 34 | display | caps, 0.1em | home title only; 1.05 |

No text under 14 px anywhere (TYPE-06); the 8.5–12 px sizes in the current CSS (`.brand-copy small` 8.5 px, stat labels, kickers 12.5 px, `.work-pill` 12 px, mono labels) are all raised to `--text-caption` or `--text-nav`. Kicker: display caps `--text-nav`, tracking 0.18em, `--gold`; at most one per section and at most 24 characters (TYPE-13).

### 4.3 Typography decision

- **Two families only: Playfair Display + Medeo Sans.** Everything else is dropped from the tokens and from `@font-face` (Phase 1, safe because every use is migrated):
  - **Drop:** Capture It (710 KB), Nauryz Red Keds (572 KB), Alistair Signature (357 KB), KTF Jermilov + Stencil (132 KB), Roslindale Text ×3 (declared, never used, no Cyrillic), Medeo Mono (third family; replace by Medeo Sans with `font-variant-numeric: tabular-nums` where mono alignment was wanted). Saves about 1.9 MB of declared files (audit Appendix A). Delete the unused static font files in `client/fonts` in a separate cleanup commit.
  - Also remove the stray `'Open Sans'` and `'Montserrat'` fallbacks.
- **Body = Medeo Sans, not Playfair.** Reasons: (1) Playfair Display is a high-contrast display face drawn for ≥24 px; its hairlines break up on a dark ground at 17–18 px (halation), which is the exact case for older readers on a phone in daylight; (2) Medeo Sans is a variable family with real weights and an italic, and the audit verified Kazakh lowercase rendering in it; (3) the screenshot's lead paragraph is the one place a text-size serif appears — we keep it in Playfair at 22/19 px where it is large enough and short. Body 18 px desktop / 17 px mobile, line-height 1.7, weight 400. This is above the project floor (16/15) and meets FINAL.md's 18 px intent on desktop.
- **Kazakh glyphs.** Measured by the main session: Playfair renders ӘҒҚҢӨҰҮҺІ and әғқңөұүһі. **Required checks in Phase 1 before merging (acceptance A-T):** a test page (not committed to routes) renders `ӘӘ ҒҒ ҚҚ ҢҢ ӨӨ ҰҰ ҮҮ ҺҺ ІІ` and lowercase in Medeo Sans at 14, 18 and 24 px — **Һ/һ in Medeo Sans has never been verified (OPEN-3)**; if it falls back, the fix is to use Playfair for those characters' contexts or report to the owner; do not ship until checked. Also check `text-transform: uppercase` on strings the CMS stores in lower case («Күй анасы» → КҮЙ АНАСЫ, «Қор туралы» → ҚОР ТУРАЛЫ, «Кітапхана» → КІТАПХАНА): `і`→`І` and `ү`→`Ү` must not become Latin or dotless forms. Set `lang` on `<html>` (already done) so `uppercase` uses the language rules.
- **Weights.** The `@font-face` for Playfair declares only 400. The nav/button text in the screenshot looks slightly heavier. Use 400 only (`font-synthesis: none` is set). **OPEN-4:** if `PlayfairDisplay.ttf` is a variable font (likely, file is named without weight), the engineer may change the `@font-face` to `font-weight: 400 900` and use 500 for nav/buttons and 600 for the hero lead; that is a CSS declaration, not a new font. Verify in the test page; otherwise stay at 400.
- **Italic.** Drop `PlayfairDisplay-Italic.ttf` (328 KB) unless quotes need it; pull quotes use Playfair roman 400 at `--text-lead`. Medeo Sans italic stays for emphasis in body. **OPEN-5:** owner may prefer italic quotes.
- **Optional (propose to the owner, not in this task):** convert the two Playfair TTFs to WOFF2 (about 60% smaller). PERF-04.
- **Names.** `h1…h6`, `p`, `figcaption`, `.nav-link` currently carry `overflow-wrap: break-word; word-break: break-word` globally (`styles.css:257-273`). Replace with `overflow-wrap: break-word` only (no `word-break`), and for every person-name element (`.master-header h3`, `.leader-name`, `.modal-header h2`, `.council-card h3`, `.stele-*` names): `overflow-wrap: normal; hyphens: manual; text-wrap: balance`, wrap only between words, and size with `clamp()` so the **longest single word in the data** fits at 320 px (content width 264 px; for a 12-letter caps word at 0.04em tracking that is about 24 px; the engineer computes this from `kuishiData.js` with a one-off script and records the max in the PR). This fixes P0-2.

### 4.4 Shell, grid, rhythm

- `.site-shell`: no radius, no border, no shadow, no blur, no background (canvas shows), `width: 100%`, **remove `overflow-x: clip`** (also `html`/`body` `overflow-x: hidden`) after the header fix so overflow is visible during QA (RESP-01). `body { padding-left: var(--rail-width) }` stays.
- **Rail** (`OrnamentRail.jsx`, `.ornament-rail`): `--rail-width: 24px` at ≥641, `16px` at ≤640 (today 64/28). Background `--forest-deep`, `border-right: 1px solid var(--gold-dark)`, no box-shadow. `.ornament-rail-inner`: `background-size: 18px auto` (≥641) / `12px auto` (≤640), `background-position: center top`, `repeat-y`, opacity 1. This matches the screenshot (a narrow braid at the page edge). **OPEN-6:** `/patterns/kazakh-rail-gold.svg` was drawn for 44 px; at 18 px the tile may turn to mush. The engineer must view it at 18 px at 1× and 2× DPR; if illegible, use 28 px rail with `background-size: 22px auto` (and 20 px on mobile) and tell the owner. The final ornament-strip image from the owner replaces `background-image` only (same box). Keep `z-index` of the rail below header/modals; `aside aria-hidden` unchanged.
- Tokens: `--container: 1160px`; `--gutter: clamp(16px, 4vw, 56px)`; `.content-width { width: min(var(--container), 100% - 2 * var(--gutter)); margin-inline: auto }` (replaces `min(1040px, 100% − 140px)`). Reading column: `--measure: 36em`. Left edge of header and hero copy and first content block is the same (`.content-width`), so there is one vertical axis (SPACE-04).
- Section rhythm (new tokens, from the quality standard): `--section-space-s: clamp(32px, 6vw, 48px)`, `--section-space-m: clamp(48px, 8vw, 96px)`, `--section-space-l: clamp(72px, 12vw, 160px)`. Use `m` between ordinary sections, `l` before/after the map and the Muragerler band, `s` inside dense lists. No other vertical section paddings.
- Z-index: header 100, rail 90, popover 200, modal 300 (do not add values).
- Radius: 2 px for buttons/inputs/cards, 0 for images and bands, `50%` only for the emblem and the medallion. **No pills.** Shadow: none, except popovers/modals: **NEW** `--shadow-pop: 0 16px 40px rgba(0,0,0,.45)` (neutral black, replaces wine-tinted shadows; justification: the only elevation cue needed).
- Breakpoints (project set; do not add): 480, 640, 768, 960, 1024 and the one new threshold 1360 for the header only (§5.1). Existing 600/680/681/820/900/1050 queries are collapsed to the nearest of these in the phase that touches each component.

### 4.5 Components (global)

**Buttons** (`.button`, `.steppe-btn`, all page CTAs; one class family `button`, variants `button-gold` / `button-outline` / link):
- Common: Playfair 400, `--text-nav`, caps, tracking 0.14em, min-height 52 px (44 at ≤480 is also acceptable but use 48), padding 0 28px, radius 2 px, border 1 px, `white-space: nowrap` for ≤ 20-character labels else wraps centred (never overflows at 320: allow wrapping at ≤480, `min-height` not `height`).
- **Gold** (`.button-gold`): bg `--gold`, text `--forest-deep`, border `--gold`; hover bg `--gold-light`; active bg `--gold` with `translateY(1px)`; disabled: bg `--forest-light`, text `--ink-muted`, border `--forest-light`.
- **Outline / dark** (`.button-outline`, hero "Дина туралы"): bg `--forest-light`, text `--ink`, border `--border-ui`; hover bg `--green`, border `--gold`; active bg `--forest`; disabled: opacity .5, no hover.
- **Text link** (`.underlined-link`): body font 16–18 px, `--gold`, 1 px underline offset 4 px (`text-decoration-thickness: 1px`), hover `--gold-light`. No arrow glyph welded to text and no icon unless it replaces a word (scanner CP3/I3).
- At most one gold button per viewport (IDN-05): hero → gold "Күй картасына"; Dina block → text link; Muragerler band → gold; callout → gold. They are never visible together at 1280×800 except possibly the Muragerler/callout at the page end — at that point keep only the callout gold and make Muragerler an outline button.

**Links in body text:** `--gold`, underlined 1 px, hover `--gold-light`. Visited: unchanged.

**Focus ring (all themes now one):** `outline: 2px solid var(--gold-light); outline-offset: 3px`. 7–12:1 on every surface. Remove every `outline: none` that is not replaced (`.search-modal-input`, `.canon-search-box input`, `.name-ref-hoverable`, the registration fields at about `styles.css:6579`) — inputs get the ring on the field wrapper via `:focus-within` if the inner input has no border. Never hide the focus under the header (header is not sticky, §5).

**Form fields** (search, canon search, registration, admin): bg `--forest-deep`, text `--ink`, placeholder `--ink-muted`, border 1 px `--border-ui`, radius 2 px, min-height 48 px, padding 0 16 px, font `--text-ui` 16 px; focus: border `--gold` + ring as above; error: border 1 px `--gold-light` (interim) + message in `--text-caption` below with a text label and `aria-describedby`; labels above the field, `--text-caption` `--ink`, sentence case (no caps). Disabled: bg `--forest`, text `--ink-muted`.

**Cards** (one pattern per purpose, SIMP-03): *catalogue entry* (person, stele, mini-card), *volume*, *story link* (discover), *callout panel*. All: bg `--forest-light` (or none, hairline only, when on a `--forest` band), `border: 1px solid var(--border-gold)`, radius 2 px, padding `--spacing-lg` (24), no shadow, no lift on hover; hover: border `--gold`, title colour `--gold-light`; whole card is an `<a>`; focus ring as above. Equal-width 3–5 card rows are not used (AIT-08): see §9 per page.

**Hairline rule with diamond** (`.rule-diamond`, shared: hero and `section-topline`): 1 px `--gold` at 70%, a 7 px square rotated 45° (`--gold`, filled) centred, with 8 px clear gap each side. Implement as a flex row `::before` line, diamond `span`, `::after` line (the draft markup `.steppe-hero-rule > span` is the diamond). Used at most once per viewport.

**Page banner** (`.page-banner` — one component, replaces the 9 copies; Phase 4): full-bleed band, min-height 280 px (≥961) / auto at ≤960 with padding `--section-space-m` 0. Background: the section photo (`.page-banner-image img`, `object-fit: cover`, `opacity` untouched) under a **solid scrim** `linear-gradient(90deg, rgba(11,28,21,.92) 0%, rgba(11,28,21,.8) 55%, rgba(11,28,21,.45) 100%)` (a photo scrim, allowed by AIT-04); text over the 80–92% portion → contrast 4.5:1 (verify, A11Y-05). Content on `.content-width`: breadcrumb (top, §4.5 breadcrumb), kicker (parent section name, `--text-nav`, `--gold`), h1 (`--text-h1`, caps, `--gold-light`; wraps by words, `text-wrap: balance`), lead (`--text-lead`, `--ink`, max-width 34em), bottom hairline `--border-gold`. This fixes the dark-theme unreadable banner (P1-7).

**Breadcrumb** (`<nav aria-label>` with `<ol>`, `aria-current="page"` on the last item; links are `<a href>`): `--text-caption`, `--ink-muted`, separator "/" in `--gold-dark` via CSS, current page `--ink`; link hover `--gold-light`, underline. Min touch height 44 px (padding 12px 0 on links).

**Modals** (search, mobile menu, person details, reader): one pattern. Backdrop `rgba(11,28,21,.86)`; panel bg `--forest-light`, 1 px `--border-gold`, radius 2 px, `--shadow-pop`, max-width 640 (search) / 720 (details) / full-screen at ≤640; close button 44×44, text-label icon "✕" replaced by the RiCloseLine svg with `aria-label`; `role="dialog" aria-modal="true" aria-labelledby`; focus trap and return; Esc. The person-details modal and the reader modal currently have none of these (A11Y-10): add in Phase 4. Heading inside: display h2 `--text-h3`.

**Footer** (`.site-footer`, Phase 1 shell + Phase 4 content): full-bleed band `--forest-deep`, top border 1 px `--border-gold`, padding `--section-space-m` 0 `--section-space-s`. Content width. Three columns ≥961 with proportions 5/3/3 (brand + one-paragraph blurb | «Бөлімдер» list | one more block): headings `--text-nav` caps `--gold`, no icons (`PiBookmarksDuotone` etc. removed), links are `<a>` (not buttons) in `--text-body` 17–18 px `--ink`, hover `--gold-light`; list shows **all six sections** (remove `.slice(0, 4)`; XPAGE-04). The «Басқару» column with the admin pitch is removed (the medallion in the header is the entry; XPAGE-05): keep one low-emphasis text link in the bottom line only if the owner wants it (**OPEN-7**). Bottom line: copyright + description, `--text-caption`, `--ink-muted`, top hairline. Contact details: **OPEN-8** (none supplied; do not invent). At ≤640 single column, sections in a 2-column list is not allowed (labels are long): stack.

## 5. Header (full spec)

DOM order: brand, `nav.desktop-main-nav`, `.header-actions` (search, QR, lang group, medallion, mobile toggle). The header is **not sticky** (position static/relative) at every width: avoids covering focus (WCAG 2.4.11) and keeps QR landing pages calm; **OPEN-9:** owner may want it sticky on mobile later.

Common: bg `--forest` solid, no blur, `border-bottom: 1px solid var(--line)`, `z-index: 100`. Brand: `BrandMark` 44 px, `color: var(--gold)`; wordmark «КҮЙ АНАСЫ» via CSS caps from the existing `strong` text (`text-transform: uppercase`), Playfair, 18 px, tracking 0.18em, `--gold-light`, line-height 1.1; tagline `small`: `--font-body`, 13 px / line-height 1.3, weight 400, `--ink-muted`, sentence case, 2 lines, `max-width: 17em`. At 14 px the tagline column would be about 250 px wide and break the one-row fit, so 13 px is the single sanctioned size below 14 px (a decorative sub-line, 7.4:1 contrast); see OPEN-10 against QS TYPE-06. Brand link has `aria-label` (existing).

Nav: Playfair 14 px caps, tracking 0.1em, `--ink`; item min-height 44, padding 0 4px, gap 28 px (single-row tier) / 32 px (two-row tier); hover `--gold-light`; **active**: `--gold-light` + 2 px `--gold` underline, offset 8 px, `aria-current="page"`; focus ring per §4.5. The labels are `SHORT_NAV_LABELS` or `navLabels` as is; the `home` slug is not in the desktop nav (existing filter) and is reached via the brand.

Actions: search button and QR button 44×44, no border, icon 20 px `--ink`, hover `--gold-light`, `aria-expanded` set on QR; separated from the lang group by 8 px. Lang group: three buttons KZ / RU / EN, Playfair 14 px caps tracking 0.12em, min 44×44 hit area (padding 0 10px), inactive `--ink-muted`, active `--gold-light` with 2 px `--gold` underline offset 8 px, `aria-pressed` exists. Group has no pill background.

### 5.1 Breakpoints

| Width | Layout | Height |
|---|---|---|
| **≥1360** | One row: `[brand + tagline] [nav centred, margin-inline auto] [search QR lang medallion]`. Header inner = `.content-width` with `--container: 1160px`, but the header may use up to `min(1280px, 100% - 2*var(--gutter))` (`--header-container`) so everything fits. Nav gap 28, tracking 0.1em. | 72 px |
| **961–1359** | **Two rows, deliberate masthead**: row 1: brand + tagline left, actions right (search, QR, lang, medallion); row 2: nav centred full-width, `border-top: 1px solid var(--line)`, gap 32. Done with `display: grid; grid-template-columns: 1fr auto; grid-template-areas: "brand actions" "nav nav"` — DOM order unchanged (brand, nav, actions), so no `order` on interactive containers. Nav is `justify-content: center`; it never wraps (the longest kk, ru or en set ≈ 650 px at 14 px caps tracking 0.1em fits in ≥ 900). | row 1: 72, row 2: 48 → 120 px |
| **≤960** | Hamburger. Bar 64 px: brand (emblem 40 px + wordmark 16 px / 0.16em, **no tagline**) left; right: search 44×44, menu button 44×44 (`RiMenu4Line`, 24 px, border 1 px `--border-ui`, radius 2 px). Nav, lang, QR, medallion live in the overlay. | 64 px |
| **≤480** | Same, gutter 16, emblem 36 px, wordmark 15 px/0.14em; wordmark never wraps (it is 9 characters ≈ 150 px, total with emblem and two 44 px buttons ≈ 320 → at 320 viewport the usable width is 304 − 32 = 272: wordmark drops to 14 px/0.1em at ≤ 359 px; the engineer verifies at 320 and 360). | 60 px |

Why 1360, not 1280: arithmetic with Playfair caps (avg ≈0.68 em/char): brand ≈ 246 px (emblem 44 + gap 12 + tagline column ≈ 190), nav ≈ 5 items ≈ 50 chars → ≈ 540 + 4×28 = 650, actions ≈ 280, minimum gaps 2×24 → ≈ 1230; plus rail 24 and gutters 2×28 → ≈ 1310; 1360 leaves 50 px of slack for the longest of kk/ru/en. **The engineer must run the RESP-02 width sweep (959, 960, 961, 1024, 1100, 1200, 1279, 1280, 1359, 1360, 1440) in kk, ru and en and raise the 1360 threshold if any control touches the viewport edge**; the rule is "collapse where the longest label set stops fitting with ≥ 24 px slack", not a fixed number. This fixes P0-1 and the audit open question 1 (no item is dropped; the nav moves to its own row).

### 5.2 Mobile menu (≤960)

Full-screen overlay (portaled, `role="dialog"`, `aria-modal`, labelled, translated). bg `--forest-deep`; top bar identical to the closed bar with a close button 44×44. Body: nav list, each row an `<a href>` with min-height 56 px, Playfair 20 px (`--text-h3`-ish, mixed case from `navLabels`, not caps, for legibility of long Kazakh labels), `--ink`, bottom border 1 px `--line`; active row: `--gold-light` + 2 px `--gold` left border (the one sanctioned 2 px stripe, ≤2 px per AIT-12) and `aria-current`. Home is the first row. No numerals, no descriptions, no arrows. Under the list: utility group on `--forest` with 16 px padding: language row (3 buttons 44 px, same style as desktop, `aria-pressed`, visible group label), a QR row (button «QR-код осы бет» that opens the same popover as a centred dialog `width: min(320px, 100% − 32px)`), account row (login or user card + admin/logout, text buttons, outline style). Bottom: watermark line removed (it said "ҚОР · 2026", a date claim not required). Scroll lock on `body`; focus trap; focus returns to the toggle; Esc.

### 5.3 QR popover (≥961, anchored)

Anchored under the QR button, right-aligned to the actions group: width 248 px, bg `--forest-deep`, 1 px `--border-gold`, radius 2 px, `--shadow-pop`, padding 16, `z-index: 200`. Content top to bottom: title (Playfair 18 px, `--ink`, e.g. existing label), QR image 180×180 on a `--parchment` tile (the PNG itself is parchment, no extra tile), 12 px gap, hint (`--text-caption`, `--ink-muted`), download as outline button full width ("PNG жүктеу", `--text-nav` caps style, min-height 48, icon 16 px allowed since it replaces nothing — **remove the icon**, text only per AIT-07; the file name pattern is in the draft). Close: Esc, outside click, button 44 px top-right. The popover must stay inside the viewport at 961 px (right-aligned, so yes). Loading: a 180 px empty tile with the text "…" is replaced by a 180 px tile showing `--ink-muted` text «Жүктелуде…» (translated); error: the translated error text + no download button. The QR encodes `window.location.href` (hash route, with language prefix): correct for QR landing.

### 5.4 Medallion (account entry)

44×44 circle, bg `--forest-light`, 1.5 px `--gold` ring, centred 20 px outline user icon in `--gold` (an actual ornamental disc image is the owner's later asset; **OPEN-11**: if the owner supplies a medallion image, it goes inside the same 44 px circle `object-fit: cover`, ring kept). Hover: bg `--green`, ring `--gold-light`. Logged in (`.logged-in`): bg `--gold`, icon `--forest-deep`, `aria-label` with the user name. Click: logged out → `#admin`; logged in → opens `.account-popover-menu`, below, right-aligned, 224 px wide, same panel style as §5.3, items 48 px tall text rows (icons removed except none), role badge shown as plain `--text-caption` text (no pill), `Esc` closes and returns focus. (The XPAGE-05 concern that a login button is public is acknowledged; the owner chose it.)

### 5.5 Search

Icon button as above; the existing modal pattern restyled per §4.5. Input 56 px high, `--text-ui`; results: rows 56 px, title Playfair 18 px, category `--text-caption` `--ink-muted`; selected/hover row bg `--green`; empty state text + hint; result count in an `aria-live="polite"` region (A11Y-15). Hint chips ("Жиі ізделетін бөлімдер") become a plain list of text links (no pills; no unverified "101").

## 6. Hero

### 6.1 Grid and size

Section `.steppe-hero`, full-bleed (to the viewport right edge; the rail is left of it because of body padding), `position: relative; overflow: hidden; isolation: isolate`. The **header is above it, not overlapping** (keeps the header solid and avoids contrast guesses).

- ≥961: `min-height: clamp(560px, 100svh − header, 760px)` → at 1440×900 about 760; at 1366×768 about 560–640; at 1920×1080 760. Inner: `.steppe-hero-inner` is `.content-width`-based but max `--header-container`; CSS grid `grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); column-gap: clamp(24px, 4vw, 64px); align-items: center;` copy column left, media column right. Vertical padding `--section-space-m` top and bottom (min-height does the centring).
- 641–960: one column; copy first, media below; `min-height: auto`; padding `--section-space-m` 0.
- ≤640: see §6.6.

### 6.2 Layers (z-order, bottom to top)

1. **Sky** `.steppe-hero-sky` (§6.3): the placeholder or the photo.
2. **Scrim**: `::before` on the hero, `linear-gradient(90deg, rgba(11,28,21,.82) 0%, rgba(11,28,21,.68) 34%, rgba(11,28,21,.15) 62%, rgba(11,28,21,0) 100%)` plus `linear-gradient(180deg, rgba(11,28,21,.35) 0, rgba(11,28,21,0) 22%)` under the header edge. At ≤960 (copy over the full width): the 90° gradient becomes 180°: `rgba(11,28,21,.78)` for the top 55% fading to `.15` at the bottom. Text contrast after the scrim must be ≥ 4.5:1 for the lead (sample the brightest 5% pixels behind the lead on the real photo; if the real photo is brighter than the placeholder, raise the scrim opacity, not the type size).
3. **1861 numeral** `.steppe-hero-year`: aria-hidden; Playfair; `font-size: clamp(160px, 26vw, 400px)`; `line-height: .8`; `color: transparent; -webkit-text-stroke: 1px rgba(215,180,95,.14)`; position absolute `right: calc(var(--gutter) - 2vw); bottom: -0.06em`; `z-index` below the media; hidden at ≤480 (`display: none`, too much noise at 320). It is decorative and never touches text (it sits right of the copy column at ≥961; at 641–960 it sits bottom-right behind the media).
4. **Media** (§6.5) and **eagle** (later).
5. **Copy** `.steppe-hero-copy`.

### 6.3 Sky placeholder and the real photo

Placeholder: palette-only stops, no new hues. On `.steppe-hero-sky` (position absolute, inset 0): sky = `linear-gradient(180deg, var(--forest-deep) 0%, var(--forest) 35%, var(--forest-light) 68%, var(--green) 80%)`; sun glow = a `radial-gradient(ellipse 42% 26% at 47% 78%, var(--gold) 0, transparent 70%)` layer at opacity .5; `.steppe-hero-sun`: a 36 px circle `--gold-light` with `box-shadow: 0 0 60px 20px rgba(240,215,140,.35)` at (47%, 78%) (this is the one glow; it is the sun, an image element, not UI decoration); `.steppe-hero-horizon`: bottom 20% band `linear-gradient(180deg, rgba(11,28,21,0), var(--forest-deep))` (the dark steppe). Three layers exist as markup already. This is an honest placeholder; it will look flatter than the screenshot — expected (**OPEN-12**: owner approves the placeholder or waits for the photo).

**Plugging in the real photo (no layout change):** supply `client/public/images/hero-steppe-sunset.jpg` (and `…-mobile.jpg`, see below). In `SteppeHero.jsx` set `HERO_BACKGROUND = '/images/hero-steppe-sunset.jpg'` (the code already sets `--hero-photo` and `data-has-photo="true"`). CSS: `.steppe-hero[data-has-photo="true"] .steppe-hero-sky { background: var(--hero-photo) center 62% / cover no-repeat, var(--forest-deep); }` and `[data-has-photo="true"] .steppe-hero-sun, … .steppe-hero-horizon { display: none }` (the photo carries its own sun and horizon). Photo spec for the owner: 2400×1400, sun at x 45–50%, y 70–76% (so the copy column on the left sits in the darker sky), subject-free left 40%, JPEG/WebP ≤ 500 KB (PERF-05), plus a 1000×1400 portrait crop for ≤640 with `image-set`/`@media (max-width:640px) { --hero-photo-mobile }` — the engineer may use a second custom property `--hero-photo-sm`. `background-position` per breakpoint: desktop `center 62%`, ≤960 `55% 70%`, ≤640 `52% 75%` so the sun stays in frame. **No `<img>` for the background**; alt is not needed (decorative).

### 6.4 Copy column

At ≥961 (all values `clamp` where stated):

| Element | Spec |
|---|---|
| `BrandMark.steppe-hero-emblem` | 52 px (≥961), 44 px (≤960); `color: var(--gold)`; margin-bottom 20 px. |
| `.steppe-hero-kicker` | `--font-display`, 14 px, caps, tracking 0.2em, `--gold`, margin-bottom 12 px; the text is stored as «Күй анасы» жеке қоры with guillemets, uppercased by CSS. |
| `h1.steppe-hero-title` | `--text-hero`: `clamp(34px, 4.4vw, 72px)`, Playfair 400, caps (CSS), tracking 0.1em (0.08em at ≤480), line-height 1.05, `--gold`, `text-shadow: 0 2px 24px rgba(11,28,21,.55)` (legibility on photo, not a glow); `margin: 0 0 20px`; wraps by words only (`text-wrap: balance`); at 1440 ≈ 63 px, "КҮЙ АНАСЫ" ≈ 430 px wide. |
| `.steppe-hero-rule` | 320 px (≥961) / 100% max 260 px (≤640), the rule-diamond of §4.5, margin 0 0 20px. |
| `.steppe-hero-person` | display, 15 px (≤960: 14), caps, tracking 0.16em, `--gold-light`, margin-bottom 20; one line at ≥ 361 px; at ≤360 it may wrap after the "·" (do not break the dates `1861–1955`: wrap the dates in a `nowrap` span via CSS `white-space: nowrap` on a span **or** accept the line break only at spaces — the existing string has spaces around "·", so natural breaking is between name and dates, acceptable). |
| `.steppe-hero-lead` | `--font-display` 400, `--text-lead` (22 px ≥961, 19 px ≤960), line-height 1.55, `--ink`, `max-width: 26em`, margin-bottom 32px; the screenshot lead looks heavier — see OPEN-4; if Playfair at 22 px is unclear over the real photo, fall back to `--font-body` 500 at 20 px (decision made by the engineer after viewing, recorded in the PR). |
| `.steppe-hero-actions` | flex, gap 16, wrap; buttons §4.5 (gold "Күй картасына" first, outline "Дина туралы"). At ≤480 the buttons are `width: 100%`, stacked, gap 12. |

### 6.5 Media slot (draft image now, video later)

`figure.steppe-hero-media`, right grid column, `position: relative`, `align-self: stretch`, `min-height: 420px` (≥961). Fixed **slot box**: `aspect-ratio: 3 / 4`, `width: min(100%, 460px)`, `margin-inline: auto` (center of the right column), `height` derived. The slot is a stable box; the content is `position: absolute; inset: 0`. That is what makes the video drop-in without layout change.

**Draft dombra** (`.steppe-hero-dombra`): the PNG (2000×3400) contains two views; the left (front) view occupies x ≈ 150–1040 px of the 2000 px width (≈ 7.5–52%); the right (side) view starts at about 1310 px. Crop to the front view with a wrapper: `.steppe-hero-dombra { position:absolute; inset:0; display:grid; place-items:center }`, inner crop box `aspect-ratio: 1150 / 3400; height: 100%; overflow: hidden; transform: rotate(20deg); transform-origin: 50% 85%` and `img { height: 100%; width: auto; max-width: none; margin-left: 0 }` so only x 0–1150 shows (the string of the right view at x ≈ 1316 stays outside). `filter: drop-shadow(0 18px 28px rgba(0,0,0,.5))` (the one shadow in the hero, grounds the object). Tilt 20° clockwise (from the screenshot: neck leans right). Size: the rotated instrument's bounding height ≈ 78% of the slot height at ≥961 (≈ 53% of the hero height). Alt text: the image is a **draft**, instrument photo not a portrait → `alt=""` and `aria-hidden` while `data-draft="true"`; when the owner approves the final asset the alt becomes a real description (`HERO_MEDIA.alt`). **OPEN-13:** the PNG's alpha must be checked (the viewer shows a white field, i.e. transparent or white); if the background is **opaque white** the instrument cannot sit on the sky and the owner must supply a cut-out — then the draft is replaced by a CSS outline of the dombra from `/patterns/contour-dombra-dark.svg` at 40% opacity (an existing graphic, honest placeholder). The 2.2 MB PNG fails PERF-05; engineer proposes a cropped, downscaled WebP (≈ 560×1650, ≤ 150 KB) as the draft asset — creating that file is an asset task for the owner/engineer; propose it, do not add it unprompted.

**Video later** (`HERO_MEDIA.type = 'video'`): `<video>` replaces `.steppe-hero-dombra` inside the same `figure`, `position:absolute; inset:0; width:100%; height:100%; object-fit: cover; object-position: 50% 30%`. The video is muted, loop, `playsInline`, `poster` always set (the poster is what reduced-motion users and slow connections see), `preload="metadata"`, `autoPlay` only when not reduced-motion (the draft already does this). Slot aspect ratio stays 3 / 4 unless the owner supplies a different ratio: **OPEN-14: ask for the video aspect ratio and a poster frame; the slot should be 3/4 portrait for an elder with a dombra, with the instrument in the lower half so the headline column is not crowded.** A mask `mask-image: linear-gradient(180deg, #000 80%, transparent)` at the bottom edge blends it into the horizon; no border/frame. Provide a pause control only if the video is longer than 5 s with motion (MOT-04): **a 44 px "Тоқтату / Пауза / Pause" icon-button at bottom-left of the slot, shown only when type is video and the user has not reduced motion** (the video autoplays ≥ 5 s, so this is a Blocker for the video phase; build the button when the video arrives, not now). No audio, ever (MOT-11). The video file is not in the repo until it is supplied; do not reference a missing path.

**Eagle (later):** an absolutely positioned transparent PNG/WebP (`.steppe-hero-eagle`, aria-hidden, `alt=""`), right 3%, top 38%, width `clamp(72px, 9vw, 140px)`; hidden at ≤640. Not built now (asset missing): leave a comment hook only.

### 6.6 Mobile (375 and 320)

- ≤960 and ≥481: one column, order: emblem, kicker, title, rule, person, lead, buttons, **then the media slot** (below the copy), centred, `width: min(70%, 320px)`, `margin-top: 32px`. Sky photo/placeholder behind everything; scrim vertical.
- **375 × 667 first screen:** header 64, hero starts; copy block ≈ emblem 44 + 12 + kicker 20 + 12 + title 2 lines? ("КҮЙ АНАСЫ" at 34 px with 0.08em: ≈ 9×(34×.68+2.7) ≈ 235 px: **one line** at 375 (content 343) and at 320 (content 288)) 38 + 20 + rule 8 + 20 + person 20+16 + lead (19 px, 4–5 lines ≈ 150) + 28 + buttons 2×48+12 = 108 → ≈ 540 px; so by the first fold you see title, lead and the gold button; the media slot starts below the fold (desired: the title leads, the media follows). Hero `min-height: auto`, padding-block 32 / 48.
- ≤480: kicker may wrap to two lines (fine), no `1861` numeral (display none), the media slot width `min(62%, 240px)`, rotated dombra still 20° but its bounding box ≈ 85% height; no overflow (`overflow: hidden` on hero **and** verify the rotated box with `overflow: visible` in a test, RESP-01).
- **320:** content width 288 − check: title 34 px one line must fit 288 px: (computed ≈ 235) yes; person line wraps; buttons full width; no element has `min-width` > 280. The `1861` is hidden.
- Reduced motion: no autoplay; the poster (or draft image) is static; no transitions apart from colour changes ≤150 ms.

## 7. Interaction and motion

Subtle only; every item has a purpose (MOT-01):

| Motion | Purpose | Spec |
|---|---|---|
| Link/button colour, border colour | feedback | 120 ms ease-out, colour/border only, no transform, no scale; gold button press `translateY(1px)` 80 ms |
| Popovers and menus (QR, account, mobile overlay) | orientation | opacity 0→1, `translateY(4px)→0`, 180 ms (overlay: opacity only, 200 ms); exit 120 ms |
| Page changes | continuity | none (instant); scroll to top is already handled by the router; no Lenis (remove, MOT-09 — per audit P2-14; it is the owner's call whether to remove now, **recommendation: remove in Phase 1**, it lags 1–2 s and conflicts with scroll-locked dialogs) |
| Hero | none ambient | static; the video (later) is the only movement; no parallax; the sun/glow do not pulse |
| Map zoom | meaning (client asked slow) | unchanged, 600–1200 ms, instant under reduced motion (already handled in `HeritageMap.css`) |
| Hover/ focus on cards | feedback | border-color only |

`@media (prefers-reduced-motion: reduce)`: all transitions/animations `0.01ms` (existing rule kept), `scroll-behavior: auto`, video not autoplayed, JS timers (gallery) not started. `scroll-behavior: smooth` only inside `(prefers-reduced-motion: no-preference)`.

## 8. Implementation phases and acceptance criteria

**Phase 1 — tokens, shell, header, footer shell, QR (one PR, approx. 1 day).**
Work: dark values into `:root`; new tokens (§4.2); font tokens and `@font-face` pruning (drop 6 families; keep Medeo Sans normal+italic, Playfair roman, Playfair italic only if OPEN-5 says yes); remove body mosaic, shell card look and blur; rail restyle; `.content-width`; global focus ring; `h1…p` word-break fix; buttons base; header (§5) incl. mobile overlay, QR popover, medallion, language switch; footer content per §4.5; remove the Lenis init if approved. Delete the `[data-theme="dark"]` wine-tint rules listed in §10 (everything in the 4757–4870 block that is not a token), keeping `data-theme="dark"` attribute on `<html>`.
Acceptance:
- P1-a `npm run build` passes; no console errors; no request to a font CDN.
- P1-b Header at 959, 960, 961, 1024, 1100, 1200, 1279, 1360, 1440, 1920 in **kk, ru, en**: every control fully inside the viewport (screenshot + `getBoundingClientRect` check), no row wrapping unexpectedly, no horizontal scroll with `overflow-x` clip/hidden **removed** (RESP-01/02, P0-1).
- P1-c ≥44×44 hit area on every header control (RESP-05); focus ring visible on each on `--forest`; keyboard order = visual order.
- P1-d Mobile overlay: Esc closes, focus trapped and returned, links are `<a href>`, no numerals, no unverified counts; all `aria-label`s follow the page language.
- P1-e QR popover: opens, shows a code that decodes to the current URL (test with a phone, not with a mock), PNG downloads at 1024 px with a sensible name; closes on Esc/outside/hashchange; works at 961 and in the overlay at 375.
- P1-f Glyph test page (§4.3) passes for both families incl. Һ/һ and uppercase; evidence screenshot attached.
- P1-g Contrast: every token pair in §4.2 used in the header/footer meets the stated ratio (axe/Lighthouse 0 `color-contrast` on `#/kk`).
- P1-h No `backdrop-filter`, no `border-radius` > 2 px except the emblem and medallion on shell/header/footer.

**Phase 2 — hero (≈ 0.5–1 day).**
Work: all `.steppe-hero-*` CSS per §6; dombra crop; placeholder sky; `--hero-photo` hook; reduced-motion; video-ready slot (no video code path beyond what the component has).
Acceptance:
- P2-a At 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 375×667, 320×568: no overflow; the title, lead and both buttons are visible without scrolling at ≥ 1280×720, title+lead+gold button at 375×667.
- P2-b Hero text contrast measured on the brightest 5% of pixels behind each text ≥ 4.5:1 (placeholder and, when it exists, the real photo).
- P2-c Replacing `HERO_MEDIA` with a `type: 'video'` stub (local test, not committed) changes no box size (slot stays 3/4); with reduced motion emulated the video does not play and the poster shows.
- P2-d Rotated dombra does not clip at any listed size and does not overlap the copy column at ≥ 961; the `1861` numeral never touches text.
- P2-e No console errors from a missing media file; Lighthouse CLS ≤ 0.1 (image has width/height or the slot's aspect-ratio).

**Phase 3 — home sections (≈ 1–1.5 days).** §9.1. Acceptance: no equal 3-card row on home (AIT-08), at most one gold button per viewport, no icons-in-circles, no `✦`, no pill; every section's colours are tokens; the heritage map still opens a region and focuses the person modal as today; each section tested at 375 and 1280; stats band hidden unless CMS has a block.

**Phase 4 — other pages (in this order, one PR each, ≈ 0.5–1 day each).** 4a shared page banner + breadcrumb + StandardPage/ContentBlock/Callout + 404; 4b canon pages + person modal; 4c library shelf + volumes + reader modal; 4d alley + monument; 4e about (leadership, charter); 4f Muragerler; 4g admin tokens pass. Acceptance per page: P1-b style no-overflow at 320/375/768/1024/1280 in kk (and ru for text-heavy pages); contrast 0 failures; names unbroken (LONGNAME at 320, TYPE-11); focus ring everywhere; every old `[data-theme="dark"]` override and legacy-alias use in that component's CSS deleted; the AI-tell scanner `node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src` count of P1 findings must not increase relative to the previous phase (baseline 15; target ≤ 5 at the end).

**Final phase 5 (optional):** delete unused fonts/files, `HERO_SLIDES` copy in the gallery, remove `data-theme` plumbing, `react-icons/pi` and `lucide-react` usages (one icon set: **recommend `react-icons/ri` only** — it is already the set the header uses).

## 9. Per-page notes

General rule for every page: bands alternate `--bg-canvas` / `--forest`; page banner (§4.5) on every sub-page; content on `.content-width`; h2 mixed case Playfair; body Medeo Sans 17–18 px; one dominant element per screen; no card grids with equal siblings except a 6+ item homogeneous catalogue.

### 9.1 Home (`HomePage.jsx`), order as today

1. **Hero** (§6).
2. **Dina Nurpeisova block** `.featured-person#dina-nurpeisova` — the reference for the redesign (audit §13). Full-bleed on `--forest`: left 7/12 columns the photograph `dina-monument.jpg` (aspect 4/5 at ≥961, 4/3 below, `object-fit: cover`, no border); right 5/12 columns text on `--forest`, padding `--section-space-m`. Kicker «ТҰЛҒА · 1861–1955» (display caps, `--gold`) — the date comes from the CMS `feature.eyebrow` or its fallback (existing); h2 `--text-h2` `--ink`; body `--text-body` `--ink` (replace `#d8c2bd`); text link «Тұлғалар каталогы» (underlined-link, no icon). Figure caption under the photo: `--text-caption`, `--ink-muted`, on a `--forest-deep` strip (not over the photo); the tooltip stays (A11Y/MOT-10: make it keyboard and tap accessible, one tab stop — not part of this redesign beyond restyling). Remove `.featured-person-pattern`, the `::before` ornament and the `::after` overlay if decorative. Mobile: photo first (4/3), text below.
3. **Heritage map** (`HeritageMap` + `.css`, tokens only): on `--bg-canvas`, full container width; panel on `--forest-light`, 1 px `--border-gold`; marker rhombus `--gold`, active `--gold-light`; selection ring per focus ring; region list is the real control at ≤640 (audit P2-18). Replace the two `[data-theme="dark"] .hm-rhombus` selectors with the default. Section title h2 + one line lead; no kicker.
4. **Stats band** (only when a CMS `stats` block exists and is cleared by content-guard): `--forest` band, h2 left; items as a ruled list not cards: figure Playfair `--text-h2`, label `--text-body` `--ink-muted`; no numerals "01/02" (the renderer in `ContentBlock` also numbers `itemIndex+1` — remove, AIT-10). Contrast: the old gold-dark-band problem disappears (no gold fill).
5. **Intro** `.editorial-intro`: two columns 6/6 on `--bg-canvas`: text left (h2, body, link), figure right (`dombra-player-illustration.png`) with the caption «КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ» — **this caption admits no attribution: INT-05/INT-08 apply. Recommendation: hide this figure until the owner confirms provenance; until then render the text full width.** (OPEN-15; do not invent a credit.) Remove `.intro-pattern`.
6. **Discover (volumes)** `.discover-section`: the CMS `cards` block with book covers. It is a **book context** so covers are legitimate; the heading from the CMS ("Жобаның басты тұлғалары") is wrong for books (INT-07): **CMS/content fix (flag to the owner): heading must name the library, not people.** Layout: not three equal cards: a staggered row on `--forest`: the first volume large (cover 5/12, text beside it), the other two smaller beneath in a 2-column pair — or, simpler and equally allowed: three horizontal "catalogue rows" (cover 96 px left, title Playfair 22, meta caption, description, text link «Оқу», hairline between rows). **Decision: catalogue rows** (cheaper, robust with 1–3 items, no equal-card grid). Covers keep `alt=""` only if the title text is adjacent in the same link (it is); else alt = volume title. Replace the `RiArrowRightUpLine`.
7. **Gallery** (`AppleTvMediaGallery.jsx`): single image band, container width, image aspect 16/9 (3/2 at ≤640), caption row under the image on `--forest-deep` (`--text-caption`), prev/next as 44 px square outline buttons with text-labelled icons and a "n / N" counter; dots removed. **Autoplay removed** (MOT-03/05, QS blocker; Recommendation — it changes existing behaviour, owner confirms; if the owner insists on autoplay: ≥ 8 s, pause button, stop on focus/hover/touch and for reduced motion). Rename later (the component carries Apple markup/`data-analytics-*`, AIT-13; out of scope here). Markup semantics (no `tablist` without panels) are an engineering task listed in the audit, not visual.
8. **Leaders** `.project-leaders-section`: replace the `.leaders-grid` of three equal cards with a **ruled list**: each leader a row on `.content-width`: left col (4/12) name `--text-h3` Playfair (nowrap rule §4.3) + role `--text-caption` `--gold`; right col (8/12) bio `--text-body`, highlights as a plain `<ul>` with a `--gold-dark` en-dash marker (CSS `::marker`/`::before`, no `✦`, no icon, no badge pill, no avatar orb). A photo (`leader.photo`) only where it exists and is a verified portrait: 96×120 px at the far left, `object-fit: cover`; **no initials orb** (INT-06). Section h2 centred is removed (left aligned, kicker removed or one short kicker). This section appears after the library; leaders duplication with the discover heading is resolved by the CMS heading fix above.
9. **Muragerler promo** (`.muragerler-section`): full-bleed `--forest-light` band; left 5/12: slogan as a Playfair 22 px line in `--gold` (no pill, no icon), h2 `--text-h2`, description, **outline** button (not gold; the callout carries the gold). Right 7/12: the 4 features as a ruled list: title `--text-h3`-smaller (Playfair 20 px, **an `h3`, not `h4`**, fixing the heading skip) + text `--text-body`; no icon orbs; hairline between items; no numbering. The stat figures of the Muragerler page are unverified and are not on the home.
10. **Callout** (`Callout.jsx`): full-bleed `--forest-deep` band with 1 px top/bottom `--border-gold`; h2 `--text-h2`, p `--text-lead` max 34em, gold button (no icon; replace lucide). **Not shown on the Library page itself** (audit P2-13) — engineer: skip `<Callout>` when `page.slug === 'library'`.

### 9.2 People section index (`people`, StandardPage) and heritage/projects/library/about indexes

`StandardPage` = banner + `ContentBlock` stack + subpage list. Banner per §4.5 (photo from `getSectionImage`; scrim ≥ .8 left). Blocks: `text` article: `--measure` column, h2, offset alternation `block-offset` kept as a 4/12 left shift **only ≥ 1024** to keep the staggered editorial feel; kicker (eyebrow) per §4.2; `quote`: Playfair `--text-lead`, left rule 2 px `--gold` (allowed ≤2 px), `cite` `--text-caption` `--ink-muted`; remove the extra «» wrap in the renderer (**the CMS body already contains «»; render `block.body` as is**, fixing the `««…».»` bug, READ-04). `stats`: ruled list as §9.1.4, no numbering. `cards`: `.mini-card-grid` → catalogue rows (§9.1.6) — the mini-card images fall back to book covers by index (`ContentBlock` line 42): book covers must not stand in for people (INT-07): render **no image** when `card.image` is empty. `callout`: band `--forest-light`, h2, text, link. `image`: full container width, `figcaption` `--text-caption` below with the credit (INT-09). `list`: `ul` with `--gold-dark` en-dash markers, 17–18 px. `qr`: `QRBlock` — `--forest-deep` tile, QR on parchment, caption. **Subpages list** (`.subpages-grid` of `subpage-card` `article onClick`): replace with a ruled list of `<a>` rows: title Playfair 22 `--ink`, description `--text-body` `--ink-muted`, «Оқу» text link; remove "N модуль" jargon (audit §11) — **a content/code change: remove that line.** Rows are real links (A11Y-08).

### 9.3 Canon pages `people-kuyshi / -zhyrau / -anshi` (`CanonPage.jsx`)

Banner (kicker «Тұлғалар», h1 canon title). Filter bar on `--forest` full-bleed strip: search field (§4.5 field, full width at ≤640, max 420 at ≥961) and school filters as **text tabs**, not pills: Medeo Sans 16 px, padding 12 px 4px, margin-right 24, `--ink-muted`; selected = `--gold-light` + 2 px `--gold` underline (`aria-pressed`), wrapping to multiple lines is fine (no horizontal scroll); min-height 44. Filter script-face labels are gone. A count text `aria-live="polite"` shows "N" = the number of rendered records (INT-02 — the label «Барлығы (101)» hard-coded in `kuishiData.js:11` must be replaced by the computed count: engineering flag).
**List, not a 2-up card grid with portraits:** a catalogue list of rows (this is a 6+ homogeneous catalogue, so a grid is allowed, but the narrow-column P0-2 comes from the 2-column card with a fixed portrait). Row at ≥768: grid `[name+dates 4fr][region+bio 6fr][action 2fr]`; row at ≤767: stacked, full width, **no portrait column at all**. Portraits: **only for verified portraits** (INT-05/06); today none of the 23 records has one → every row is text-only: name `--text-h3` (`overflow-wrap: normal`, §4.3), dates `--text-caption` `--gold` immediately under the name (en dash `1861–1955`), region `--text-caption` `--ink-muted` with no map-pin icon, bio clamped to 3 lines (`-webkit-line-clamp: 3`) in `--text-body`, works: a plain comma-separated inline list "Басты күйлері: …" (no `.work-pill`s), action text link «Толығырақ» as a real `<button>` (opens the modal). School tag as caption text, not a pill over an image. If a verified portrait is later added: a 96×120 px `<img>` in the first column at ≥768 only, with a visible credit. Rows separated by 1 px `--line`; row hover: name `--gold-light`.
**Person modal** (`master-modal-card`): pattern §4.5, h2 name, caption dates·region, `h3` (not `h4`) subheads, works inline list; no image unless verified portrait; the "✕" replaced by the labelled close button; Esc, focus trap. Empty state: text + outline button «Сүзгілерді тазарту».

### 9.4 Library shelf `library` (StandardPage) and volumes `library-vol-1/2/3`

Shelf: banner + blocks as §9.2 + the three volumes as catalogue rows with **real covers** (they exist: `book-*.jpg`): cover 120 px wide left (aspect as the image, never cropped), title, meta, link; add this on the shelf page through the CMS `cards` block (the cover fallback by index in `ContentBlock` is the only code path; the cards block there on `library` is a book context so the by-index cover is acceptable **on the library page only**; engineer: allow the fallback only when `pageSlug === 'library'`).
Volume page: banner (cover not in banner); then `.volume-meta-card`: two columns on `--forest-light`: cover left (4/12, max 280 px, 1 px `--border-gold`), facts right (`dl` grid 2-col at ≥768: `dt` `--text-caption` `--ink-muted` / `dd` `--text-body`). Facts that are unverified (ISBN, pages, «ҚР ҰҒА академиктері») are hidden until sourced (INT-01, audit §11.2): design allows rows to disappear without a hole. Chapters `.volume-chapters-list`: ruled list, chapter title Playfair 20, description `--text-body`; no numeric pills. Action row: "Мұқабасын жүктеу" as outline button (honest label); the **«Онлайн оқу» reader modal presents invented sample pages (audit P0-4): hide the button** unless the owner supplies real page images; its CSS (`reader-*`) gets restyled only if kept. Cover alt = «<volume title> — мұқабасы».

### 9.5 Alley `projects-alley`, monument `projects-monument`

Photography-first, QR-landing priority: the practical info block moves **above the stele catalogue** (audit P2-17): order banner → «Келушілерге» block (only verified fields; unverified bus/hours hidden) → zones → stele catalogue. Zones (`.alley-zones-grid`): staggered, alternating rows: image 7/12 and text 5/12 swap sides each row at ≥1024, stacked at ≤768 (image first, 3/2); no equal 4-up grid; zone image corners 0; caption `--text-caption`. Stele catalogue: school tabs as text tabs (§9.3), then a ruled list of rows: stele number/label `--text-caption` `--gold` (only if verified), name `--text-h3`, text; no `stele-badge` pill; no portrait. Monument: banner + one long reading section (`--measure`) with the bronze photo `dina-sculpture-bronze.jpg` / `dina-monument-full.jpg` as a full-container figure with credit; "anatomy" `.anatomy-grid` → a definition list; `.kuis-grid` of `kui-card` (küi names) → plain inline list in a `--forest` band, no cards. Bottom nav: two text links «← Жобалар», «… монументі →» with 44 px height; arrows only as typographic characters in the label string, not an icon pasted to the CTA — **wait: scanner flags "arrow glyph welded to CTA"; use no arrow, the links are labelled with the destination.**

### 9.6 Muragerler `projects-muragerler`

Banner with the three anchor buttons → outline buttons (no gold; the gold is the registration, if kept). The page contains unverified stats (150+, 4, 24, 100%) and **a registration form that writes to `localStorage` and then announces success (fake functionality, audit P0-4)**. Brief: the visual spec for the form exists (§4.5 fields; labels above; error pattern; 2-col at ≥768, 1-col below) **but the form must stay hidden until a real endpoint exists**; this is outside the visual redesign (flag to the main session). Stats: ruled list, hidden until verified. Directions (`directions-grid`): ruled list of 4, no cards, titles `h3`. Mentors: rows without portraits unless verified. Schedule: a real `<table>` on ≥768 (`--text-body`, header row `--text-caption` `--gold`, row lines `--line`), stacked `dl` at ≤767. FAQ: native `<details>` rows (title Playfair 20, chevron by CSS ::after in `--gold`; marker is the only icon). Gallery cards: images in 2 columns with captions; `tall` item spans 2 rows at ≥768.

### 9.7 About: leadership and charter (`AboutDedicatedPages.jsx`)

Leadership: banner; `leader-feature-card` → a two-column reading row (photo 4/12 only if verified, else text full measure), name `--text-h2`, role `--gold`, bio; `council-grid` of `council-card` (3 cards) → ruled list of 3 rows (name `--text-h3`, role `--text-caption`, bio). Charter: the four `charter-card` → one reading column with four h2/p pairs separated by hairlines (they are four short paragraphs; a card grid adds nothing); no icons. Both on `--bg-canvas`, with the callout omitted.

### 9.8 404 (`NotFoundPage.jsx`, `.css`)

`.not-found-page` on `.content-width`, min-height `60svh`, left aligned (not centred): kicker «404» (display caps `--gold`), h1 `--text-h1` (the existing translated title), p `--text-lead` max 30em, outline-or-gold button «Басты бетке» (gold: it is the only control); the big `--text-hero`-sized outlined numeral «404» as in the hero (`-webkit-text-stroke: 1px rgba(215,180,95,.14)`) behind at right, aria-hidden. Keep `role="alert"`. Footer visible. Replace `NotFoundPage.css` spacing literals with tokens.

### 9.9 Admin (`#admin`, `client/src/admin/*`)

Functional, same tokens, no decoration: no rail ornament change (the rail stays as the shell), no hero. Surfaces: canvas `--bg-canvas`, panels `--forest`, raised `--forest-light`; tables and lists: row lines `--line`, header row `--text-caption` `--gold`; fields §4.5; buttons §4.5 (gold only for the primary save/approve, outline otherwise); statuses: text badges, square (radius 2 px), 1 px `--border-ui`, label text (no colour-only status: pending/published/rejected stated as words; **OPEN-2** for a danger colour); emoji (👤 ✏️ 📝 ✅) removed; `lucide-react` icons replaced by `ri` icons only if the file is touched; `window.prompt/confirm` replaced by the shared dialog **after** the tokens pass (engineering, not visual). Heading levels: the login card title is an `h1`. Kazakh-only labels: unchanged in this task. Test at 375: panels stack, tables scroll inside their own container (`overflow-x: auto` on the table wrapper only), never the page.

## 10. Leftover wine/plum tints in the dark overrides — flag and fix

Seen in `styles.css` (94 lines match the wine/off-palette literals counted by grep). All become tokens in the phase that owns the component; in Phase 1 delete the ones in the shell/header/footer.

| Selector / location | Current | Replace with |
|---|---|---|
| `[data-theme="dark"] .site-shell` | `border: 1px solid rgba(74,31,44,.55)`, shadow `#00000088` | none (shell has no border/shadow) |
| `[data-theme="dark"] .archive-hero-copy>p`, `.intro-copy p`, `.editorial-block p`, `.subpage-card p`, `.leader-card p` | `color: #d8c2bd` (pinkish) | `var(--ink)` for body; `var(--ink-muted)` for secondary |
| `[data-theme="dark"] .archive-hero h1`, `.intro-copy h2`, `.editorial-block h2`, `.section-topline h2` | `color: #fff4f0` (pink-white) | `var(--ink)` |
| canon search `rgba(34,13,21,.9)`, modal `#1f0b13`, buttons `#2a101b`, text `#fff4f0`/`#d8c2bd` (`styles.css` ≈7802–7843) | burgundy | `var(--forest-deep)` (fields), `var(--forest-light)` (panels, buttons), `var(--ink)` / `var(--ink-muted)` |
| `.site-shell` light rule `box-shadow: 0 20px 60px rgba(51,0,14,.08)` and all `rgba(51,0,14,…)` | wine | removed / `--shadow-pop` |
| `#4a2d27` ×32 (`#4a2d27` body copy, wine brown) and `rgba(74,45,39,…)` | wine brown | `var(--ink)` / `var(--ink-muted)` per role |
| `#f3b29f` kickers on dark blocks | peach | `var(--gold)` |
| `#07130E` (`--bg-canvas` dark), `--paper: #0B1C15`, `--paper-light`, `--paper-panel` | off-palette canvas | `--bg-canvas: #0B1C15`; `--paper*` aliases deleted after migration |
| `[data-theme="dark"] .brand-copy strong` `text-shadow: 0 0 14px …` | glow | none |
| `#fff` text on `figcaption` over photos | pure white | `var(--ink)` on a `--forest-deep` caption strip (not over the photo) |
| `--plum` used as text colour in light rules, `--wine` mapped to gold | invisible/odd | semantic tokens (see §4.2) |
| banner title/lead in dark (audit P1-7: gold-dark on dark gradient; dark green lead on dark overlay) | unreadable | §4.5 banner: `--gold-light` title, `--ink` lead over a `.8–.92` scrim |
| `#d7b45f` vs `#f0d78c` "one hue pretending to be two" (scanner C8) | | allowed here: gold = text/marks, gold-light = highlight/hover; documented as two roles |

## 11. States

- **Missing image:** every `img` has a reserved ratio (`aspect-ratio`) on a `--forest-deep` background; broken images show the alt text in `--ink-muted` on that box; never a stock fallback. Hero: placeholder sky (§6.3).
- **Loading:** QR «Жүктелуде…»; page content: none (bundled defaults load instantly); admin lists use a text line, no spinners.
- **Empty:** map region without data — existing honest text; canon filter zero results — text + button; search no result — existing; CMS page with no blocks — `t.notFound` text in `--ink-muted`.
- **Error:** QR failure translated message; network error in admin — text with the interim error style.
- **Long text:** page title 120 chars at 320: h1 wraps by words (`text-wrap: balance`), no fixed heights, banner uses `min-height`; block title 300 chars wraps; LONGNAME wraps between words only; a stat value + label wraps; the nav row never has to deal with long labels (collapse rule §5.1).
- **One item vs many:** catalogue rows work for 1–N; the volume rows work for 1–3; no column breaks.
- **Not translated (EN/RU with Kazakh-only content):** a top notice in the UI language above the content: `--text-caption`, `--ink`, on a `--forest-light` strip with a 1 px `--border-gold`, text «Бұл бет қазақ тілінде» translated + link to Kazakh; content container gets `lang="kk"` (READ-05). Visual spec only; the notice itself is an engineering task.
- **Focus, hover, active, disabled:** §4.5; hover never moves layout.
- **Print:** out of scope.

## 12. Accessibility notes

- Contrast table §4.2; all text pairs ≥ 4.5:1; large and UI ≥ 3:1; the only exception candidates are the hero text over the photo (A11Y-05 sample test) and the 13 px tagline (7.4:1 but below 14 px: OPEN-10).
- One `h1` per route; the hero h1 is the title; section `h2`; person/card titles `h3`; no `h4` directly under `h2` (home Muragerler, Muragerler page, modals).
- Landmarks: `header` (banner), `nav` (main, labelled in the page language), `main`, `footer` with a labelled `nav`.
- Targets: ≥ 44×44 for header controls, lang, filters, close buttons, carousel buttons, menu rows ≥ 56 px high.
- Popovers/dialogs: Esc, focus management, `aria-expanded`/`aria-controls`.
- Reduced motion: §7. No autoplay with sound anywhere; the future hero video has a pause control (§6.5).
- Kazakh text: do not hyphenate, do not `text-align: justify`, `lang` attributes per language switch.
- Real links for navigation (`<a href={hrefFor(slug)}>`) in header, overlay, footer, breadcrumbs, subpage list (A11Y-08).

## 13. Tokens used or proposed (summary)

- **Changed values:** `--bg-canvas` #0B1C15 (was #07130E in dark); `--bg-surface` → `--forest-light`; `--rail-width` 24/16 px (was 64/28); `.content-width` formula.
- **New (justified above):** `--border-ui` (#A9853C, control boundary ≥ 3:1), `--shadow-pop`, `--container`, `--header-container`, `--gutter`, `--measure`, `--section-space-s/m/l`, `--text-caption/ui/nav/body/lead/h3/h2/h1/hero`. **Proposed, needs owner approval:** `--danger: #E6A494` (OPEN-2).
- **Removed after migration:** `--font-brand/editorial/title/quote/signature/stamp/nauryz/stencil/mono`, `--serif`, `--sans`, `--font-playfair`, `--terra`, `--plum`, `--wine`, `--ochre`, `--paper*`, `--primary`, `--accent`, `--surface`, `--bg`, `--text`.
- **No new fonts, no new npm packages, no CDN.** The `qrcode` package is already a dependency.

## 14. Out of scope

Building the sound box; generating the photo/eagle/video/ornament strip (owner); editing CMS content or the unverified numbers (flagged to content-guard/owner); the registration backend; replacing `CODE_RENDERED_SLUGS` pages by CMS blocks (contract §1.3, separate plan); CSS refactor of the 8k-line monolith beyond what each phase deletes; light theme (removed); font file conversion to WOFF2; admin functional changes (dialogs, i18n); portraits of people (none verified); the AppleTv markup rename.

## 15. OPEN questions (owner)

1. **OPEN-1** Header bar tone: solid `--forest` or translucent over the photo (the screenshot looks lighter)?
2. **OPEN-2** May we add one muted danger colour (`#E6A494`) for admin/form errors? Interim: gold-light text + label.
3. **OPEN-3** Medeo Sans Һ/һ rendering unverified; engineer's test decides (fallback: Playfair for body? no — report).
4. **OPEN-4** Is `PlayfairDisplay.ttf` variable (weights 500/600 available)? Else all Playfair text stays 400, which is lighter than the screenshot.
5. **OPEN-5** Keep Playfair italic (328 KB) for quotes?
6. **OPEN-6** Rail at 24 px: the current SVG tile may be illegible; fall back to 28 px.
7. **OPEN-7** Keep a footer admin link? **OPEN-8** Footer contact details (address/email) — none supplied.
8. **OPEN-9** Sticky header on mobile? (default: no.)
9. **OPEN-10** Tagline at 13 px (decorative) acceptable under the 14 px floor?
10. **OPEN-11** Medallion artwork supplied later?
11. **OPEN-12** Placeholder sky acceptable until the photo, and the photo's aspect/sun position per §6.3.
12. **OPEN-13** `dombra-real.png` alpha: transparent or opaque white? Draft crop, tilt 20° and asset size (2.2 MB, PERF-05).
13. **OPEN-14** Video aspect ratio, poster frame, length, and whether it should pause control show (it will).
14. **OPEN-15** Provenance of `dombra-player-illustration.png`; until known, hide it.
15. Remove the gallery autoplay and Lenis (both Recommendations from the audit, change existing behaviour).
16. Hide until sourced: stats band, volume ISBN/pages, Muragerler stats and registration form, reader modal sample pages.
