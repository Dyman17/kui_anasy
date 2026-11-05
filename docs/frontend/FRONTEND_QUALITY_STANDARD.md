Status: draft

# Frontend quality standard — «Күй анасы» (05.11.2026)

This document is the acceptance standard for any design concept (including Google Stitch output) and for the implementation. It is a checklist with thresholds, not a style guide. It does not choose the look; the direction lives in `.claude/skills/kui-anasy-design/SKILL.md` and the client brief in `FINAL.md` §3.

It references, and does not repeat, the project skills: `visual-direction`, `design-system`, `responsive-design`, `motion-design`, `accessibility`, `frontend-review`, `visual-testing`. Evidence for the problems it prevents is in `docs/frontend/FRONTEND_AUDIT.md`; the platform limits are in `docs/frontend/BACKEND_CAPABILITIES.md`.

Labels: **Recommendation** marks a threshold I propose and the owner may change. Everything else is either a rule already given by the client, the contract, WCAG 2.2 AA or a project skill. Numbers marked "baseline" come from the audit (Verified there); numbers I could not measure are marked "unmeasured".

## 0. How to read this standard

### 0.1 Severity

| Severity | Meaning | Effect |
|---|---|---|
| **Blocker** | Client rule, contract rule, WCAG AA failure, or one of the audit's P0 problems | A concept is rejected and an implementation does not merge or ship until fixed |
| **Major** | Audit P1, or a rule that makes the site inconsistent or hard to use | Must be fixed before acceptance; a concept may carry a limited number (see §15) |
| **Minor** | Polish, maintainability, audit P2/P3 | Logged; fixed when touching the area |

### 0.2 Phase

| Code | Meaning |
|---|---|
| **C** | Concept: static design, Figma, Stitch screens or HTML export. Checked on images or exported code |
| **I** | Implementation: the running site and the repo |
| **B** | Both: checked on the concept and again on the build |

### 0.3 Test fixtures (use these every time)

- **Widths:** 320, 375, 768, 1024, 1280. 1024 is added to the project matrix because the audit's P0 header failure lives at 961–1280 px. Header sweep widths are in RESP-02.
- **Languages:** kk (default, longest in the header), ru (longest in body text), en.
- **Themes:** light "parchment", dark «Түнгі дала».
- **Route set R:** home, a section index (`people`), a canon list (`people-kuyshi`), a CMS article, a library volume, an alley or monument page, 404, `#admin` login screen.
- **Glyph string (GLYPH):** `Әә ҒғҚқ Ңң Өө Ұұ Үү Һһ Іі`. Uppercase test: `ӘӘ ҒҒ ҚҚ ҢҢ ӨӨ ҰҰ ҮҮ ҺҺ ІІ`.
- **Longest-name string (LONGNAME):** the longest real name in `client/src/constants/kuishiData.js`. Known case from the audit: `ҚҰРМАНҒАЗЫ САҒЫРБАЙҰЛЫ`.
- **Scripts S1–S10 and commands G1–G25** are in Appendix A and B. Tables cite them by code.

### 0.4 What "verified" means

A check not run is reported "not run", never "pass" (`visual-testing`). A concept is judged on screenshots or exports only; do not infer behaviour that is not drawn.

## 1. Distinctive visual identity

The site must be recognisable from its colour, type and layout devices, with the logo and wordmark masked.

**Core palette (client-approved, from the «Ұлы дала әуені» cover):**

| Role | Token | Hex |
|---|---|---|
| Deepest green | `--forest-deep` | `#0B1C15` |
| Primary green | `--forest` | `#10291F` |
| Raised green | `--forest-light` | `#1D4030` |
| Accent gold | `--gold` | `#D7B45F` |
| Dark gold (lines, badges) | `--gold-dark` | `#A9853C` |
| Canvas | `--parchment` | `#F2EBDD` |
| Surface | `--paper` | `#E8DFC9` |
| Ink | `--ink` | `#26372D` |

**Documented derived tokens that are also allowed** (same hues, in `:root` today): `--gold-light #F0D78C`, `--paper-light #F7F2E7`, `--paper-shade #D9CEB4`, `--ink-muted #536458` (light) and `#A8B8A6` (dark muted), `#24523E` (dark `--green`). The dark canvas `#07130E` is a darker shade of the same green but is not in the client table. **Recommendation:** replace it with `#0B1C15`, keeping the palette to the 8 core colours.

**Hue windows (for the "no new hues" test):** warm 36–48° (gold, parchment, paper) and green 135–165° (forest, ink). I computed these from the core palette: forest family 152–156°, ink 145°, gold 42.5°, parchment 40°, paper 42.6°. Colours with HSL saturation under 15% (muted greys such as `#A8B8A6`) are exempt from the hue test.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| IDN-01 | Every non-photographic colour is one of the 8 core hexes or a documented derived token above. In a concept: every dominant UI colour (covering at least 0.5% of non-photo pixels) is within ΔE2000 ≤ 6 of one of them. In code: zero colour literals outside the token blocks (`:root`, `[data-theme="dark"]`). | C: eyedrop or read the exported colour list and compare. I: G2 (baseline 235 hex lines, 189 rgba lines). | Blocker | B |
| IDN-02 | No new hues: every colour with saturation ≥ 15% lies in the warm or green hue window above. No purple, blue, red, orange or teal in UI chrome. | Convert each listed hex to HSL; reject any outside the windows. Photographs are exempt. | Blocker | B |
| IDN-03 | No legacy wine or terracotta: `--terra`, `--plum`, `--wine`, `--ochre` and `#4a2d27` have zero uses in components (they stay only as token aliases until removed). | I: G2 legacy command (baseline 171 token uses, 32 × `#4a2d27`). | Blocker | I |
| IDN-04 | Colour proportions on a 1280 px screenshot, photographs excluded: light theme has parchment plus paper ≥ 55% of pixels and gold (`--gold`, `--gold-dark`, `--gold-light`) ≤ 8%. Dark theme has the forest family ≥ 70% and gold ≤ 10%. | Count pixels by nearest palette colour on the screenshot (any image tool). **Recommendation** (thresholds). | Major | C |
| IDN-05 | Gold discipline: at most one gold-filled control per viewport; gold as text only on dark surfaces; gold on light surfaces only as rules, marks or borders that are decorative. | Review each viewport screenshot; A11Y-02 gives the contrast side. | Major | B |
| IDN-06 | Signature devices: every page type shows at least 4 of 6. (1) Left ornament rail, 64 px desktop and about 28 px mobile, required by the client. (2) The single main typeface set large in the page title, with at least one Kazakh-specific letter visible. (3) Palette proportions of IDN-04. (4) One instrument contour from `client/public/patterns/contour-*.svg` at ≤ 12% opacity, at most one per viewport, never under text. (5) Documentary photo treatment: captioned, credited, from at most 3 aspect ratios. (6) Hairline rules (1 px, from `--line` or `--border-gold`) as the only separator device. | Tick the 6 devices per page type on the concept pack (§15). | Major | B |
| IDN-07 | Logo-masked lineup: three reviewers see the home screen with logo and wordmark covered, among two screens of other cultural sites. At least 2 of 3 pick the right one. | Run once per concept. **Recommendation.** | Minor | C |
| IDN-08 | The cover image `uly-dala-aueni-cover.jpg` is never used as a background or stretched hero. The only emblem is the final vector (`client/public/brand/*.svg`, `favicon.svg`); no glowing or neon logo variants. | C: review. I: grep `uly-dala-aueni-cover` in CSS and JSX shows no `background` use. | Blocker | B |
| IDN-09 | If a page-background gradient exists (the contract asks for one, `FINAL.md` §3.3), there is exactly one per theme, linear, with stops only from core palette hexes. **Recommendation** for the stops (the client has not specified them): dark `#0B1C15` to `#10291F`; light `#F2EBDD` to `#E8DFC9`. | G9 gradient count: only the background plus photo scrims (IDN/AIT-04). | Major | B |
| IDN-10 | Contract ornaments (parchment texture, dombra silhouette, national ornament; Annex 1 §2) appear at most once each per viewport, at low contrast, never under body text, never replacing content. | Review. Interpretation conflict with the skill ("no faux parchment textures") is an open question, §17. | Major | B |

## 2. Typography and hierarchy

One main family. The client requires it; Literata is proposed and not yet approved (`FINAL.md` §3.5). Until approved a concept names its family in the pack and that family must pass TYPE-02.

**Recommendation — type scale (7 steps, new tokens `--text-*`):**

| Step | Token | Desktop 1280 | Mobile 375 | Use |
|---|---|---|---|---|
| 1 | `--text-caption` | 14 px | 14 px | captions, credits, meta |
| 2 | `--text-ui` | 16 px | 16 px | nav, buttons, labels, form text |
| 3 | `--text-body` | 18 px | 17 px | articles and body copy |
| 4 | `--text-lead` | 22 px | 19 px | lead paragraph, quotes |
| 5 | `--text-h3` | 28 px | 22 px | h3 |
| 6 | `--text-h2` | clamp 28–40 px | 28 px | h2 |
| 7 | `--text-h1` | clamp 36–64 px | 36 px | h1 and page title |

Adjacent steps differ by at least 12%. `FINAL.md` §3.5 asks for 18 px or larger for older readers; the Blocker below is the project floor from the skills (16/15), and 18/17 is the Recommendation.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| TYPE-01 | Exactly one font family in all text (plus a system fallback stack). No second display, script, mono or quote face. `@font-face` families = 1. | C: read the font list in the pack. I: G1 (baseline 13 rules, 9 families). | Blocker | B |
| TYPE-02 | Every face, weight and style used contains the Kazakh letters in both cases (U+0492/0493, 049A/049B, 04A2/04A3, 04AE/04AF, 04B0/04B1, 04BA/04BB, 04D8/04D9, 04E8/04E9, 0406/0456). GLYPH renders with no fallback glyph at 16, 24 and 48 px in every weight used, and in uppercase. Һ/һ is explicitly confirmed (not verified in any face yet). | Read the cmap with a font tool (fontTools `ttx -t cmap`, or Wakamai Fondue) and render a test page. | Blocker | B |
| TYPE-03 | Body text is at least 16 px at 1024 px and wider, and at least 15 px at 480 px and narrower. **Recommendation:** articles at 18 px / 17 px. | S2 at 375 and 1280. Fail: any paragraph below the floor. | Blocker | B |
| TYPE-04 | At most 8 distinct computed font sizes per page at 1280 and at 375 (7 scale steps plus one optional display size). No two steps within 12% of each other. | S2 census. Baseline: 10 different h2 clamps. | Major | B |
| TYPE-05 | All font sizes come from tokens: zero `font-size: Npx` literals outside token definitions; exactly one size definition per heading level. | I: G3 (baseline 217 px declarations, 59 at or below 12 px). | Major | I |
| TYPE-06 | No text smaller than 12 px anywhere; functional text (nav, buttons, labels, form, filters) at least 14 px; captions and credits at least 13 px. | S2; G3 (small-size count must be 0). | Major | B |
| TYPE-07 | Line length: at 768 px and wider, the median line of every paragraph with 300+ characters is 55–75 characters. At 480 px and narrower, the median line is at least 28 characters (guards against narrow columns). | Measure line breaks with `Range.getClientRects()` on a long paragraph, or count characters in a screenshot. | Major | B |
| TYPE-08 | Line height: body 1.5–1.8; headings 1.05–1.3. | Computed style on body and h1–h3. | Minor | B |
| TYPE-09 | Heading levels: exactly one h1 per route; no skipped level (an h4 may not follow an h2); headings are never used only for size. | S12 outline on every route in R. Baseline: h4 under h2 on home and Muragerler. | Major | B |
| TYPE-10 | Same level, same style: computed size, weight and line height of h1, h2, h3 are identical on every route at the same width (±0.5 px). | Compare S2 samples on 4 routes. | Major | I |
| TYPE-11 | Names are never broken. At 320 and 375 px zero words of 4+ characters are split across lines (S5), and `LONGNAME` fits its container without horizontal overflow. Names in headings and cards use `white-space: nowrap` with fluid sizing. No `word-break: break-word` or `break-all` on headings, cards or names. | S5 and S1 at 320; G17 (global rule at `styles.css:257-273` is the known offender). | Blocker | B |
| TYPE-12 | No script, handwriting or decorative face for functional text (nav, buttons, filters, stat labels, form text, captions, footer headings); weight 400 or heavier below 24 px; no italic for more than 2 lines. | G18 and computed `font-family` census (S2 also returns family). Baseline: Alistair Signature on filters and stat labels. | Blocker | B |
| TYPE-13 | All-caps tracked labels: one style site-wide, at most 3 per viewport, at most 24 characters each, never on text of more than one line. Uppercase of GLYPH renders (TYPE-02). | Count `text-transform: uppercase` instances on 4 routes. | Minor | B |

## 3. Spacing and layout consistency

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| SPACE-01 | Spacing uses the 4 px scale (`--spacing-xs..xxl` = 4, 8, 16, 24, 36, 64). In code: zero margin, padding or gap literals outside tokens. In a concept: all spacing values are multiples of 4, at most 8 distinct values per page. | I: G4 (baseline 612 literal lines, tokens used once). C: read Figma auto-layout values. | Major | B |
| SPACE-02 | Section vertical padding takes at most 3 distinct values site-wide at 1280, each a named token (fluid values allowed). **Recommendation**, new tokens `--section-space-s/m/l`: `clamp(32px, 6vw, 48px)`, `clamp(48px, 8vw, 96px)`, `clamp(72px, 12vw, 160px)`. | S6 on home, section index, article, volume. | Major | B |
| SPACE-03 | At most 3 container max-widths site-wide: reading (≤ 75ch, about 720 px), content (≤ 1040 px as today), wide (≤ 1216 px inside the rail). Side gutters ≥ 16 px at 320, ≥ 24 px at 768. | Computed `max-width` on `main > *` containers. | Major | B |
| SPACE-04 | Alignment: at 1280 the left edges of headings, body and image blocks in `main` fall on at most 2 vertical axes (±1 px), except deliberate full-bleed. | `getBoundingClientRect().left` of each first-level child of every `main` section (S6 variant). | Major | B |
| SPACE-05 | One column grid with a gutter token: 12 columns at ≥ 1024, 8 at 768, 4 at ≤ 480. Staggered blocks snap to columns. | C: grid overlay on the concept. I: `grid-template-columns` values belong to at most 4 patterns. | Minor | B |
| SPACE-06 | Decorative layers (contour patterns, ornaments) never intersect a text bounding box. | C: overlay review. I: intersect the rect of each decoration element with text elements on home (audit: kobyz outline touches the Dina block). | Major | B |
| SPACE-07 | Left rail and content do not collide: content starts at least 24 px after the rail edge at every width. | Rect check at 320 and 1280. | Minor | I |

## 4. Whitespace

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| WS-01 | Purposeful density: a page with 4+ sections has at least one open section (padding at least 1.5× the page median, at most 60 words, one dominant element) and at least one dense section (catalogue or list of 6+ comparable rows). | Classify each section on the screenshot or DOM. | Major | B |
| WS-02 | No uniform rhythm: no more than 2 consecutive sections share the same padding, layout skeleton and background. A page uses 2 or 3 section padding values (SPACE-02), not 1. | S6 output in order. | Major | B |
| WS-03 | One dominant element per screen: at each of the 375 and 1280 scroll positions (top, +1, +2 viewports), the largest image or heading is at least 1.5× the area or font size of the next one; the page survives an 8 px blur squint test with one focal region. | Screenshot review; S2 for the type ratio. | Major | C |
| WS-04 | Proximity: space above an h2 is at least 1.5× the space below it; paragraph spacing is 0.75–1.25 line heights. | Computed margins. | Minor | B |
| WS-05 | Mobile whitespace is deliberate, not desktop shrunk: at 375 section padding is 32–64 px; no blank run taller than 1.2 viewports. | Screenshot scroll at 375. | Minor | B |

## 5. Responsive behaviour

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| RESP-01 | No horizontal scroll at 320, 375, 768, 1024, 1280 on every route in R, in kk, ru and en, in both themes. Masked overflow also fails: with `overflow-x: clip/hidden` on `html`, `body` and `.site-shell` removed in DevTools, no visible element extends beyond the viewport. | S1 (both parts). Audit cause: `overflow-x: clip` at `styles.css:338` hid the P0 header overflow. | Blocker | B |
| RESP-02 | The header (brand, 6 nav items, search, language switch, theme, and any account control) fits in Kazakh at every width: every control is fully inside the viewport and the header does not wrap to a second row. Test widths: 320, 375, 480, 768, 959, 960, 961, 1024, 1100, 1200, 1279, 1280, 1440, 1920. The nav collapses at the width where the Kazakh labels stop fitting, not at a design-chosen width. | S9 at each width, `lang=kk`. Baseline fail: 1024 (all right cluster clipped), 1280 (login missing). | Blocker | B |
| RESP-03 | Collapsed menu: opens and closes by button and Esc; page behind does not scroll; focus moves in and returns; reaches all six sections; each row at least 44 px tall; every label stays on one line (theme label wrapped at 375 in the audit). | Keyboard and `visual-testing` steps at 375 and 768. | Major | B |
| RESP-04 | Every pointer target is at least 24 × 24 CSS px (WCAG 2.2 SC 2.5.8). | S3 with threshold 24 at 375. | Blocker | B |
| RESP-05 | Primary controls are at least 44 × 44 px with at least 8 px between them: language switch, theme, menu, search, close buttons, filters, carousel and map controls. Inline links in running text are exempt. Map markers have a 44 px hit area, or the list under the map is the control. | S3 at 375 (threshold 44). Baseline: language pills about 22 px tall, header icons 35–38 px. | Major | B |
| RESP-06 | Images keep their aspect ratio: with `object-fit: fill` the rendered ratio is within 1% of natural. With `cover`, a declared `aspect-ratio` and an `object-position` chosen per breakpoint; the key subject stays inside the crop. | S10; C: art-direction note per image. | Major | B |
| RESP-07 | DOM order equals visual order: no `order` property on interactive containers. Mobile order is title, lead, then media or the reverse, stated per page type. | G10 variant (`order:` in CSS); read-through at 375. | Major | B |
| RESP-08 | Reflow and zoom: at 320 CSS px and at 200% browser zoom on a 1280 window, no content or function is lost and there is no two-direction scroll (WCAG 1.4.10). | `resize_window` 320×800 and 640 px proxy. | Blocker | I |
| RESP-09 | Long content stress at 320: the longest page title (120 characters), a block title (300), `LONGNAME`, a card with a 3-line bio, and a stat value with its label all wrap or fit without clipping or overflow; no fixed `height` on text containers. | Render fixtures; G (height) check on text containers. | Major | B |
| RESP-10 | Narrow-column guard: no text container narrower than 160 px at 320; card layouts with a fixed-size portrait stack below 480 px when the text column would be under 200 px. | Rect check on cards at 320, 375 (audit: name column was about 70 px). | Major | B |
| RESP-11 | Sticky header never covers an anchor target or a focused element: `scroll-padding-top` and `scroll-margin-top` ≥ header height; full-height sections use `dvh` or `min-height`, not `100vh`. | Keyboard Tab and anchor click at 375. | Minor | I |
| RESP-12 | Landscape phone (812 × 375): header, menu and a content page remain usable, with no clipped controls. | `resize_window` 812×375. Not tested in the audit. | Minor | I |

## 6. Interactions and motion

Purposes allowed (`motion-design`): feedback, continuity, orientation, attention.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| MOT-01 | Every transition and animation is listed in the brief with one of the four purposes. Unlisted motion count = 0. A concept describes motion in notes; ambient motion is not drawn. | I: G13 list; C: motion notes. | Major | B |
| MOT-02 | No ambient motion: no infinite animation (one loading spinner allowed, removed on completion), no parallax, no scroll-triggered fade-in. All content is visible with JavaScript animation disabled and before scrolling. | G13 (`infinite`); scroll test with reveal disabled. | Major | I |
| MOT-03 | No automatic slide advance faster than 5 s. **Recommendation:** no auto-advance at all (audit baseline: hero 2 s, gallery 5.5 s). | G13 (`setInterval`) and a stopwatch on each carousel. | Blocker | B |
| MOT-04 | If anything moves automatically for longer than 5 s, there is a visible pause control at least 44 px, keyboard-operable, with a state label ("Pause" / "Play" in the page language). It also stops on hover, on focus within, on touch, when the tab is hidden, and for good after the user changes slide. | Keyboard and pointer test per carousel. | Blocker | B |
| MOT-05 | Reduced motion: with `prefers-reduced-motion: reduce` emulated, a carousel does not change slide over 12 s, there are no transform transitions (opacity ≤ 150 ms may stay), no smooth scroll, and the map zoom is instant. JavaScript timers check `matchMedia`. | Emulate and wait 12 s. Baseline: CSS only; JS timers still ran. | Blocker | I |
| MOT-06 | Carousel semantics: region labelled `aria-roledescription="carousel"`, slides as labelled groups, prev/next as buttons, no `tablist` without `tabpanel`s, no `li role="tabpanel"` inside `ul`. All slide content is also reachable without the carousel (list or grid fallback). | `read_page` accessibility tree. | Major | B |
| MOT-07 | Durations: hover and press 100–150 ms; small elements 150–200 ms; panels, modals, drawers 200–300 ms; page-level at most 400 ms; exits faster than entrances. Only exception: the heritage map zoom, which the client wants slow and smooth; **Recommendation** 600–1200 ms. | G13 duration list compared with this table. | Major | I |
| MOT-08 | Only `transform` and `opacity` transition; zero `transition: all`; zero transitions on width, height, top, left, margin, box-shadow or filter on large areas. | G13. | Minor | I |
| MOT-09 | No scroll hijacking: no smooth-scroll library (Lenis); `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`. A wheel scroll lands within one frame (no inertia lag; audit saw 1–2 s lag). | G13 (`lenis`); wheel test. | Major | I |
| MOT-10 | Hover-only content has a focus and tap equivalent: tooltips and name-bio cards open on focus and on tap, close with Esc, stay open while hovered or focused (WCAG 1.4.13), and one control has one tab stop. | Keyboard and touch emulation. Baseline: `Tooltip` wraps buttons in a focusable span (two stops). | Major | B |
| MOT-11 | No media autoplays with sound; no autoplaying hero video. | Load each route in R and listen. Currently no audio or video exists. | Major | B |
| MOT-12 | Hover feedback is colour, underline or border only; any lift is at most 2 px; no scale effects on cards. | Computed `transform` on hover. | Minor | I |

## 7. Accessibility (WCAG 2.2 AA)

Procedure and fixes are in the `accessibility` skill. This section sets thresholds.

### 7.1 Contrast pairs from the palette (computed by hand, WCAG relative luminance)

I computed these from the sRGB values; re-run S4 to confirm before relying on a borderline value. Pass: text 4.5:1, large text (24 px, or 18.66 px bold) and UI 3:1.

| Foreground on background | Ratio | Text use |
|---|---|---|
| `--ink` `#26372D` on parchment `#F2EBDD` | 10.62 | pass, body |
| ink on paper `#E8DFC9` | 9.50 | pass, body |
| `--ink-muted` `#536458` on parchment | 5.31 | pass, secondary text |
| ink-muted on paper | 4.75 | pass, secondary text |
| `--gold-dark` `#A9853C` on parchment | **2.90** | **fail at any size**; also fails 3:1 as a UI boundary |
| gold-dark on paper | **2.59** | fail at any size |
| `--gold` `#D7B45F` on parchment | **1.67** | fail |
| gold on paper | **1.50** | fail |
| parchment on gold-dark | **2.90** | fail (stat band in the audit used paper on gold-dark, 2.6) |
| ink on gold-dark | 3.66 | large text and UI only |
| forest `#10291F` on gold-dark | 4.49 | fail by a rounding margin; do not use |
| forest-deep `#0B1C15` on gold-dark | 5.13 | pass |
| forest on parchment | 13.03 | pass; use for light-theme focus ring |
| parchment on forest | 13.03 | pass, dark body |
| parchment on forest-deep | 14.86 | pass |
| parchment on forest-light `#1D4030` | 9.68 | pass |
| gold on forest-deep | 8.88 | pass |
| gold on forest | 7.79 | pass; use for dark-theme focus ring |
| gold on forest-light | 5.79 | pass |
| gold-dark on forest-deep | 5.13 | pass |
| gold-dark on forest | 4.49 | fail |
| gold-dark on forest-light | 3.34 | large text and UI only |
| dark muted `#A8B8A6` on forest-deep | 8.45 | pass |
| dark muted on forest | 7.41 | pass |
| dark muted on forest-light | 5.50 | pass |
| ink on gold (button fill) | 6.35 | pass |
| forest on gold (button fill) | 7.79 | pass |
| forest-deep on gold | 8.88 | pass |

**Consequence:** in the light theme `--accent-gold` (= `--gold-dark`) cannot be a text colour. **Recommendation:** add one token `--accent-text` that is `--ink` in the light theme (or `#7A5F22`, a darker shade of the same hue, 5.08:1 on parchment and 4.54:1 on paper, if the owner wants a gold-looking text) and `--gold` in the dark theme. It is a new token; it needs owner approval.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| A11Y-01 | Every text and background pair used in a concept meets 4.5:1 (3:1 for large text), in both themes, using actual colours sampled from the screens or the exported CSS. | Eyedrop pairs; S4. | Blocker | C |
| A11Y-02 | Gold as text: `--gold` and `--gold-dark` as `color` on parchment or paper = 0 instances. On dark surfaces `--gold` text is allowed; `--gold-dark` text is allowed only on forest-deep. The skill's own rule ("never gold text on parchment below 4.5") applies to nav, kickers, breadcrumbs, hero lines, stat bands and secondary CTAs. | I: computed-colour census (S4 over all text nodes) and review of `var(--terra)`, `var(--accent-gold)`, `var(--primary)` as `color`. | Blocker | B |
| A11Y-03 | Zero contrast failures on every route in R in both themes and all three languages. | axe DevTools or Lighthouse accessibility audit shows 0 `color-contrast`; plus a screenshot of banner text in dark (audit: `#people` dark unreadable). | Blocker | I |
| A11Y-04 | UI boundaries and graphics (input borders, icon buttons, selected state, focus ring) reach 3:1 against the adjacent colour. Decorative rules are exempt only when `aria-hidden`. Gold-dark borders on parchment (2.90) do not qualify; use ink-muted (5.31) or ink. | S4 on each border colour. | Major | B |
| A11Y-05 | Text over photographs reaches 4.5:1 at the brightest plausible pixel behind it. Either a solid or at least 85% opaque forest-deep scrim, or a separate panel. | Sample the worst 5% of pixels behind the text; screenshot at 375 and 1280. | Major | B |
| A11Y-06 | Focus is visible on every interactive element in both themes: outline at least 2 px, offset at least 2 px, 3:1 against adjacent colours (light `--forest` 13.03, dark `--gold` 7.79). No `outline: none` or `0` without an equal replacement. The focused element is never fully hidden by the sticky header (WCAG 2.4.11). | G11 (audit: search input, canon search, name hover, form field); Tab through 3 routes. | Blocker | I |
| A11Y-07 | Keyboard only, these tasks complete: skip link to `main` is the first Tab stop; change language; toggle theme; open and close search; open a map region; filter a canon list; open a person entry; read an article; reach the footer. No keyboard trap; one tab stop per control; DOM order equals visual order. | Keyboard script on 2 routes; count tab stops against controls. | Blocker | I |
| A11Y-08 | Real links and buttons: navigation is `<a href>` with the real route `#/{lang}/{slug}` (opens in a new tab, copies correctly, works for QR); actions are `<button>`. Zero `onClick` on `div`, `span`, `article`, `li`. Zero `<a href="#">`. Zero buttons that only navigate. | G10 (baseline: header, footer, breadcrumbs and 8 templates use buttons; two cards not focusable). | Blocker | I |
| A11Y-09 | Landmarks and names: one `header`, one `main`, one `footer`; primary nav and footer nav labelled; breadcrumb is `<nav aria-label>` with an `<ol>` and `aria-current="page"` on the last item; every icon-only control has an accessible name in the page language (zero Kazakh or Russian `aria-label` on the EN route). | `read_page` on 3 routes in 3 languages. | Major | I |
| A11Y-10 | Dialogs (search, menu, details, reader): one component, `role="dialog"`, `aria-modal`, `aria-labelledby`. Focus moves in on open, is trapped, returns to the trigger on close; Esc closes; page behind is inert or scroll-locked; close button at least 44 px with a name (no bare "✕"). Native `<dialog>` with `showModal()` satisfies most of it. | Keyboard steps on every dialog. Baseline: 2 of 4 fail entirely, none trap focus. | Blocker | I |
| A11Y-11 | Forms: visible `<label>` for every field; error text next to the field, linked with `aria-describedby`, announced in a live region; required state in text; correct `autocomplete`; fields at least 44 px high and 16 px font; no `alert()`, `prompt()`, `confirm()`. | Submit empty and invalid forms (test environment only). | Major | I |
| A11Y-12 | Images: informative images have `alt` in the page language, decorative ones `alt=""`; zero `<img>` without the attribute; images that carry the card's information (book covers on cards) do not have empty alt; an `alt` never names a person unless the image is a verified portrait. | S11; review of canon and leader images. | Major | B |
| A11Y-13 | `lang`: `<html lang>` equals `kk`, `ru` or `en` after each language switch, and `<title>` changes. Any fragment in another language (Kazakh content on an EN page) carries its own `lang`. | S13 after switching on 3 routes. | Major | I |
| A11Y-14 | Text spacing override (line height 1.5, paragraph spacing 2× font size, letter spacing 0.12em, word spacing 0.16em, WCAG 1.4.12) causes no clipped or overlapping text. | Apply the override stylesheet in DevTools on 3 routes. | Major | I |
| A11Y-15 | Status messages are announced: search result count, filter result count and form success or error use `aria-live` or `role="status"`. | `read_page`; screen reader if available, else note "not tested with a screen reader". | Major | I |
| A11Y-16 | No drag-only operation: map pan and zoom work with buttons and a list of regions. | Keyboard and pointer test on the map (WCAG 2.5.7). | Major | B |
| A11Y-17 | If audio or video is added: visible controls, keyboard operation, no autoplay, transcript link or an explicit "no transcript" line. | Conditional. | Major | I |
| A11Y-18 | Admin login: password field allows paste and has `autocomplete`; no cognitive test (WCAG 3.3.8). | `#admin` screen only, no real credentials. | Minor | I |

## 8. Content readability

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| READ-01 | Article text is left-aligned (ragged right), no `text-align: justify`; no automatic hyphenation for `kk`; column measure per TYPE-07. | Computed style. | Minor | B |
| READ-02 | Long-text fixtures: render a Kazakh and a Russian text of at least 1200 words (supplied by the client; clearly labelled dummy text if absent, never published). The longest allowed CMS body (12 000 characters, one block) renders without clipping or `max-height`. | Fixture routes at 375 and 1280. | Major | B |
| READ-03 | Long articles have a sub-heading at least every 300 words and one pull-quote at most per 600 words. Images are interleaved with captions. A table of contents appears from 5 headings. **Recommendation.** | Count on the long fixture. | Minor | B |
| READ-04 | Quote marks are added in one place: guillemets «» for kk and ru, “ ” for en. No doubled marks (the audit saw `««…».»` on `#heritage`). | G (grep `««`) and visual check of `#heritage`. | Minor | I |
| READ-05 | "Not translated" state: when the UI is ru or en but the article exists only in Kazakh, a visible notice at the top of the content, in the UI language, says so and links to the Kazakh version. At least 15 px, at least 4.5:1, text and not an icon alone. The content container has `lang="kk"`. The switcher shows which languages exist (not a silent fallback). The notice is absent when a translation exists. | Switch to RU on a kk-only page (currently every CMS page). A concept must draw this state (§15). | Major | B |
| READ-06 | Chrome is fully in the UI language: header, footer, breadcrumbs, buttons and aria labels have zero Kazakh text on the EN route (audit: Kazakh footer, "СТЕЛА №01" inside EN text). | Visual check plus G16 outside the dictionaries. | Major | I |
| READ-07 | Numbers: formatted with `Intl.NumberFormat(lang)`, so thousands are separated by a no-break space in kk and ru and by a comma in en. A number and its unit are joined with a no-break space and never wrap inside the number. Stat figures use `tabular-nums lining-nums`. | Computed `font-variant-numeric`; narrow-width wrap test at 320. | Minor | B |
| READ-08 | Dates: full dates use `Intl.DateTimeFormat(lang, { dateStyle: 'long' })` and a `<time datetime>` element. Life dates are `YYYY–YYYY` with an en dash and no spaces. An unknown date is shown as an explicit phrase in the page language (not "?" or blank). No numeric-only `dd.mm.yy` outside admin tables. | Visual and DOM check of 3 person entries. | Minor | B |
| READ-09 | Captions and credits: at least 13 px, at least 4.5:1, never over a photo at lower contrast. A stat's figure is at least the `--text-h3` step and its label at least 14 px sentence case. | S2, S4. | Minor | B |

## 9. Content integrity

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| INT-01 | No invented facts or numbers. Every digit-bearing claim (2+ digits, "+", "%", years, ISBN, hours, bus routes, page counts, phone) maps to a source accepted by the owner (customer document or `FINAL.md`). Otherwise it is removed (build) or shown as an explicit placeholder (concept). | I: G15 (baseline unconfirmed: "321+", "150+", "100%", "24", ISBNs, "512 бет", bus routes). C: list every number in the screens. Route to `content-guard`. | Blocker | B |
| INT-02 | Counters derive from data: a displayed count equals the number of rendered items, and no count is typed. Fail example: «Барлығы (101)» over 9 records. Canon names that include a number (for example «101 Күйші каноны») are proper names, not counters, and the owner confirms the wording. | I: filter "all" count equals `array.length`. | Blocker | I |
| INT-03 | No fake functionality: every button, link and form does what its label says. Click-through of every control on each route in R: zero no-ops. A form either reaches a real endpoint and shows the server's answer, or is absent. Zero `localStorage` simulated submit, zero `alert()` success, zero play button without audio. A "download" label names the file (the cover, not the book). | G14 (baseline: Muragerler form writes `localStorage`, "online reader" shows invented pages); click-through. | Blocker | B |
| INT-04 | Text promises only features that exist: "audio guide", "personal QR code", "digital passport", "online reading", "interactive map of every stele" and similar claims are absent unless the feature is live. | G15 promise words (baseline: Alley, People and Library copy). | Blocker | B |
| INT-05 | An illustration is never presented as a portrait. Each image has a kind: portrait, illustration, photo, document, cover. The portrait frame (a face-led crop with a name caption) is used only for a verified portrait with a recorded source. Illustrations carry a visible translated label and an `alt` that names no person. | I: component API has `kind`; C: frame styles differ. Baseline: stele, book covers, alley and product photos shown as portraits of 23 records. | Blocker | B |
| INT-06 | Missing portrait: a person entry without a verified portrait is complete with text only. No silhouette, no avatar, no initials posing as a photo, no stock face. | Render an entry with no image at 375 and 1280. | Blocker | B |
| INT-07 | A book cover appears only in a book context (library, volume, citation). It is never a person's image or a person band (audit: leader bands on home). | Review home, people, library. | Blocker | B |
| INT-08 | No generated imagery. Every raster and illustration has a recorded provenance (author or archive, licence). In a concept, any image not already in `client/public/images` or supplied by the client is replaced by a neutral placeholder box that shows its aspect ratio and label (Stitch output with generated photos fails). | C: replace-or-fail. I: provenance list in the PR. | Blocker | B |
| INT-09 | Every photograph and archival scan has a visible credit (author or archive) in `figcaption` or an image detail. A photo with no known credit is not shown as a historical document. | I: grep `<img` against captions. C: caption pattern is drawn. | Major | B |
| INT-10 | No hard-coded biography, date or claim without a source: the 13 tooltip biographies and all canon bios come from the CMS, each with a source line. | I: G16 on `ReferenceTooltip.jsx` and `kuishiData.js`. | Major | I |
| INT-11 | Honest empty states: regions or lists without data say so in words in the page language (the map already does: "being completed"), with no placeholder records. | Open an empty map region. | Minor | B |

## 10. Avoiding generic AI patterns

Fail conditions on a concept (checkable on a screenshot) and on the build. Scanner: `node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src` (G25). Baseline from the audit: 30 findings, P0 0, P1 15, P2 15.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| AIT-01 | Scanner reports **0 P0**. | G25 | Blocker | I |
| AIT-02 | Scanner P1 count ≤ 5 at acceptance; no change may raise it above the current 15 meanwhile. **Recommendation** (threshold). | G25. P1 rules in the baseline: worn Lucide set, arrow glyph welded to CTA, accented headline word, tracked caps, side-stripe cards, glass, one-radius soft-shadow look, emoji icons. | Major | I |
| AIT-03 | Scanner P2 count ≤ 10. **Recommendation.** | G25 (baseline 15, mostly middle-dot meta strings). | Minor | I |
| AIT-04 | Gradients: only the page background (IDN-09) and photo scrims from forest-deep to transparent behind text. Zero gradient on buttons, cards, banners or text. | C: review. I: G9 gradient count and review each hit. | Major | B |
| AIT-05 | No glass: zero `backdrop-filter`, blurred panels, or translucent surfaces over imagery (the 28 px frosted `.site-shell` over a blurred photo mosaic must go). | G9 `backdrop-filter` count = 0. | Major | B |
| AIT-06 | Radii: at most 3 values, none above 8 px for controls and cards; pills (radius ≥ 999 px or 50% on non-square elements) 0 for buttons, filters and badges. Map markers and avatars are exempt. | G8 radius census (baseline 12, 14, 20, 28 px, 18 lines of pills). | Major | B |
| AIT-07 | Icons: only where they replace a word and have an accessible name (search, menu, close, theme, arrows). At most 6 per viewport. Zero icons in filled circles as ornament; zero emoji as interface icons. | Count icons per viewport; G12 emoji search in admin. | Major | B |
| AIT-08 | No equal-card grid as a section layout: no section whose main content is 3 to 5 sibling cards of equal width (±2 px) and identical structure. Per page at most one equal grid, and only for 6+ homogeneous catalogue records. | S7 on home, people, library; C: squint check. Baseline: leaders grid, Muragerler features, discover cards. | Major | B |
| AIT-09 | No centred hero over three features: the first screen is not a centred headline with a row of three items below. The home hero is asymmetrical and led by a documentary photograph or the title. | Review. | Major | C |
| AIT-10 | No numbered sequences without meaning: zero "01 / 02 / 03" labels on items that have no order (mobile menu rows 01–06, stats numbering). | Review; the `stats` block renderer numbers items, so this is a renderer change. | Minor | B |
| AIT-11 | Kickers: at most one third of h2 headings carry an eyebrow, each at most 3 words; see TYPE-13. | Count on 3 routes. | Minor | B |
| AIT-12 | Zero coloured side-stripes (`border-left` thicker than 2 px as card accent); zero coloured glow shadows; at most 2 shadow tokens. | G8 variant; computed `box-shadow`. | Minor | B |
| AIT-13 | Concept export uses no default Tailwind palette classes (for example `bg-indigo-600`, `text-slate-500`): every colour is a project token. Zero copied third-party markup or names (`data-analytics-*`, "Apple TV"). | G19; `grep -ri apple client/src`. | Major | B |
| AIT-14 | Copy is not template marketing ("Discover", "Unlock", "Seamless", "Welcome to"). Every headline traces to the client's text. No lorem ipsum: placeholders are labelled. | Read the concept copy. | Minor | C |

## 11. Avoiding unnecessary complexity

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| SIMP-01 | At most 4 `@font-face` rules and 3 font files, all woff2; unused font files removed from `client/fonts`. | G1, G22 (baseline 13 rules, dozens of unused files). | Major | I |
| SIMP-02 | One icon set: imports come from exactly one package, or from local SVG; one stroke weight and size grid. | G12 (baseline 4 sets: three `react-icons` packs and `lucide-react`). | Major | B |
| SIMP-03 | Component variants: at most 3 button styles (primary, secondary, text link); at most 4 card patterns site-wide (catalogue entry, story, volume, callout); at most 2 badge or tag styles; one modal; one page banner; one kicker definition. | Class census and component list (baseline: 8+ card kinds, 10+ pill kinds, 9 banner copies, 4 modals, 2 kicker rules). | Major | B |
| SIMP-04 | Decorative layers: at most 2 per viewport (the rail counts as 1, plus one contour pattern). No blurred photo mosaic behind content. No decoration above 12% opacity under text. | Screenshot per route; G9 for `body::before`. | Major | B |
| SIMP-05 | Breakpoints: only 480, 768, 1024 plus `prefers-*` queries. | G5 (baseline 11 distinct). | Major | I |
| SIMP-06 | z-index: at most 6 distinct values, all tokens, maximum ≤ 1000 (`base 0, raised 10, header 100, overlay 200, modal 300, toast 400`). | G6 (baseline 15 values up to 999999). | Major | I |
| SIMP-07 | `!important` ≤ 5, none used to beat our own selectors. | G7 (baseline 47). | Minor | I |
| SIMP-08 | New or changed `.jsx` files ≤ 300 lines; component CSS co-located; the global `styles.css` holds tokens, base and layout only. **Recommendation:** global CSS ≤ 1200 lines (baseline 8132). | G24. | Minor | I |
| SIMP-09 | Zero new npm dependencies without owner approval. | G20. | Major | I |
| SIMP-10 | Tokens: at most 3 radius tokens, 2 shadow tokens, 2 border widths (1 px, 2 px). | G8. | Minor | B |

## 12. Cross-page consistency

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| XPAGE-01 | Header and footer markup are identical on every public route (compared after removing active-state attributes). | Diff `outerHTML` on 4 routes. | Major | I |
| XPAGE-02 | One page-header component (breadcrumb, h1, lead) is used by every sub-page. | Component grep (baseline 9 copies). | Major | I |
| XPAGE-03 | Breadcrumb on every page with a parent, none on home; `<nav aria-label>`, `<ol>`, real links, last item `aria-current="page"`, at least 14 px; depth ≤ 3. | Route walk. | Major | B |
| XPAGE-04 | Footer lists all six sections (baseline: 4, "Қор туралы" missing), is a labelled `<nav>`, is fully translated, and shows contact details once the owner provides them. | Visual check in kk, ru, en. | Major | B |
| XPAGE-05 | The editor login is not in the public header; at most one low-emphasis footer link. | Review. | Minor | B |
| XPAGE-06 | One modal and one overlay pattern for search, menu and details (A11Y-10). | Component list. | Major | I |
| XPAGE-07 | One card pattern per purpose: for each content type (person entry, volume, story link, stat) computed radius, padding, type sizes and border are identical on every page. | Computed-style diff on 2 pages per type. | Major | B |
| XPAGE-08 | At most 6 page templates (home, section index, catalogue list, profile or article, volume, place or QR page) plus 404 and admin; every route uses one. | Route table. | Minor | B |
| XPAGE-09 | Both themes are designed: a concept shows light and dark for at least home, one article and one list. Missing dark theme = incomplete concept. | C: count screens. | Blocker | C |
| XPAGE-10 | Dark theme is token-driven: one `[data-theme="dark"]` token block; at most 20 selector-level theme overrides; zero wine or off-palette literals inside overrides. | G23 (baseline 175), G2. | Major | I |
| XPAGE-11 | Every route in R is checked in both themes and three languages; no unreadable text, no off-palette surface (audit: `#people` dark banner, burgundy canon search). | Matrix run, screenshots. | Blocker | I |
| XPAGE-12 | Language switch keeps the slug and always writes the language prefix to the URL (audit: only when the route was already prefixed). | Switch on an unprefixed route. | Major | I |
| XPAGE-13 | Theme is applied before first paint: no flash of the wrong theme on reload. | Reload with dark stored, throttled. | Minor | I |
| XPAGE-14 | Document title follows one pattern per language and the h1 equals the page title. | Read titles on 4 routes. | Minor | I |

## 13. Performance budgets

Baselines from the audit: declared font files about 3.3 MB (the three display TTFs alone about 1.6 MB); `dombra-real.png` 2.2 MB and `kobyz-real.png` 1.7 MB. Public JavaScript and CSS gzip sizes were **not measured**. All budgets below are **Recommendation** and need a first measurement before they are enforced.

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| PERF-01 | Initial public JavaScript ≤ 180 KB gzip on `#/kk`. Admin, QR generation and the map are lazy-loaded. Unmeasured baseline. | `npm run build` gzip output and the Network tab, transferred size. | Major | I |
| PERF-02 | Public CSS ≤ 40 KB gzip. Unmeasured baseline (8132 lines of source). | Build output. | Minor | I |
| PERF-03 | Fonts on the home route ≤ 300 KB transferred, woff2 only, roman first; italic loads only on pages that use it; `font-display: swap`; the roman file is preloaded. Unsure: the actual size of the chosen variable file. | Network tab, filter Font. | Major | I |
| PERF-04 | Zero TTF or OTF files referenced by `@font-face` (baseline 8). | G22. | Major | I |
| PERF-05 | No image file above 300 KB (a full-bleed hero up to 500 KB); photographs as JPEG, WebP or AVIF; PNG only for line art or transparency; longest side ≤ 2× the CSS width, ≤ 2400 px. | G21 (baseline: two PNG files at 2.2 and 1.7 MB). | Major | I |
| PERF-06 | Image bytes on first load of a route at 375 ≤ 800 KB; after scrolling the whole route ≤ 2.5 MB. | Network tab, filter Img, 375 px emulation. | Major | I |
| PERF-07 | Every `<img>` has `width` and `height` or a CSS `aspect-ratio`; below-the-fold images have `loading="lazy"` and `decoding="async"`; at most one eager image with `fetchpriority="high"`; images wider than 600 px have a `srcset` of at least 2 widths. | Grep `<img` in JSX. | Major | I |
| PERF-08 | Cumulative layout shift ≤ 0.1 on every route in R at 375 and 1280. | S8 or Lighthouse. | Major | I |
| PERF-09 | Largest Contentful Paint ≤ 2.5 s on home and one article with Lighthouse default mobile throttling, production build. Total blocking time ≤ 200 ms. Unsure about the hosting effect (Vercel versus the target VPS). | Lighthouse in Chrome DevTools on `vite preview`. | Major | I |
| PERF-10 | Zero requests to third-party origins (no Google Fonts, no CDN); the API origin and a lazy YouTube embed are the only exceptions. | Network tab; `visual-testing` step 5. | Blocker | I |
| PERF-11 | `GET /api/pages` ≤ 100 KB gzip at 17 pages; revisit at 50 pages (the endpoint returns every page with every block). Unmeasured. | Network tab with the API running. | Minor | I |

## 14. CMS fit

The platform renders a banner plus a single-column stack of at most 10 block types: `heading, text, feature, quote, image, list, stats, cards, callout, qr` (`BACKEND_CAPABILITIES.md` §5, §10).

| ID | Pass condition | How to check | Sev | Ph |
|---|---|---|---|---|
| CMS-01 | Mapping table: every section and component in a concept is annotated with an existing block type, or "NEW BLOCK" (name, fields, why; needs a server enum, a renderer and an editor), or "SYSTEM" (header, footer, nav, search, map). Unannotated elements = 0. | C: annotated screens. | Blocker | C |
| CMS-02 | At least 80% of the sections on section-index and article pages map to existing blocks; each NEW BLOCK has an existing-block fallback. **Recommendation.** | Count in the mapping table. | Major | C |
| CMS-03 | Field limits are respected in the design: page title ≤ 120 characters, description ≤ 1000, block title ≤ 300, body ≤ 12 000, eyebrow ≤ 200, at most 100 items per list, stats or cards. A max-length title fits at 320 without clipping. | Render max-length fixtures (RESP-09). | Major | B |
| CMS-04 | No editable content lives in code: no page is code-rendered (`CODE_RENDERED_SLUGS` empty) and zero long Kazakh or Russian string literals in `pages/` or `components/` (bundled seed pages are allowed). This is contract §1.3. | G16 (baseline: 11 hard-coded pages plus parts of home). | Blocker | I |
| CMS-05 | Block independence: each block renders correctly alone, first, last, and in any order. The only layout variation is by block type and index parity (feature offsets left or right). No layout depends on two specific adjacent blocks. | Permute blocks in a test page. | Major | B |
| CMS-06 | Plain-text body: no element requires bold, inline links, footnotes, tables, sub-headings or multiple paragraphs inside one `body`. If the concept uses them, it marks "NEW BLOCK: rich text". **Recommendation:** render blank-line-separated paragraphs as separate `<p>` (a front-end-only change). | Review the concept's long-text screens. | Major | C |
| CMS-07 | Capabilities that do not exist are not drawn as working: audio player, video embed, gallery, PDF or download, sheet music, person data, FAQ, timetable, form, per-person QR. Each is marked "NEW BLOCK + storage (R2 or YouTube)" and shown as an explicit not-yet-functional note. | C: review. | Blocker | C |
| CMS-08 | Navigation has exactly the six contract sections with at most 2 levels beneath; the Kazakh labels fit (RESP-02); no new top-level section is drawn. | Count in the concept. | Blocker | C |
| CMS-09 | Every addressable screen has a route of the form `#/{kk\|ru\|en}/{slug}` with one slug segment matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` and at most 80 characters. No nested paths. A person page is a CMS page under the `people` parent (for example `people-<name>`). QR targets use this shape. | Review route list. | Major | C |
| CMS-10 | Admin-only states (`pending`, `rejected`, draft) never appear in public screens. | Review. | Minor | B |
| CMS-11 | The admin preview and the public site share one block renderer and the same tokens. | Component reuse check. | Minor | I |

## 15. Concept review scorecard

Use for Google Stitch or any other concept. Score only from the screens and any exported code. Do not score behaviour that is not drawn.

**Concept submission pack (required before scoring; missing items fail CMS-01 or XPAGE-09):**

1. Screens at 375 and 1280 for: home, section index, canon list, person page (a CMS page), article with long text, library volume, alley or monument (QR landing), search dialog open, mobile menu open, "not translated" state, 404.
2. Header at 1024 in Kazakh.
3. Light and dark versions of home, article and list.
4. Real Kazakh copy from the client material; labelled placeholders elsewhere.
5. Declared font family and the exported colour list.
6. A mapping table to CMS blocks (CMS-01) and a motion note (MOT-01).
7. A person entry with no portrait, and one with `LONGNAME`.

**Scoring.** Blocker rows: Pass or Fail. Major rows: 2 = pass, 1 = partial, 0 = fail. Mark "n/a" only when the pack lacks the screen (then the row counts as 0 for a Major and as Fail for a Blocker).

| ID | Check on the static concept | Sev | Score |
|---|---|---|---|
| IDN-01 | Every dominant UI colour is a core or derived palette colour | Blocker | P / F |
| IDN-02 | No hue outside the warm and green windows | Blocker | P / F |
| IDN-08 | Cover not a background; only the final emblem | Blocker | P / F |
| TYPE-01 | Exactly one family | Blocker | P / F |
| TYPE-02 | GLYPH and uppercase GLYPH render in every face used | Blocker | P / F |
| TYPE-03 | Body at least 16 px desktop, 15 px mobile (read from export) | Blocker | P / F |
| TYPE-11 | `LONGNAME` unbroken at 375; no narrow name column | Blocker | P / F |
| TYPE-12 | No script or decorative face on functional text | Blocker | P / F |
| RESP-02 | Kazakh header fits at 1024 and 1280 without clipping | Blocker | P / F |
| RESP-04 | All targets drawn at least 24 px | Blocker | P / F |
| A11Y-01 | Sampled text pairs meet 4.5:1 / 3:1 in both themes | Blocker | P / F |
| A11Y-02 | No gold text on parchment or paper | Blocker | P / F |
| MOT-03 | No auto-advance under 5 s; pause control drawn if any auto-advance | Blocker | P / F |
| INT-01 | Every number maps to a source or is a labelled placeholder | Blocker | P / F |
| INT-03 | No control that cannot work (play buttons, forms, downloads) | Blocker | P / F |
| INT-04 | No copy promising features that do not exist | Blocker | P / F |
| INT-05 | Illustrations not framed as portraits | Blocker | P / F |
| INT-06 | Portrait-less entry is complete with text only | Blocker | P / F |
| INT-07 | Covers not used as people images | Blocker | P / F |
| INT-08 | No generated imagery; placeholders for unsupplied images | Blocker | P / F |
| XPAGE-09 | Light and dark both drawn | Blocker | P / F |
| CMS-01 | Every element mapped to a block, NEW BLOCK or SYSTEM | Blocker | P / F |
| CMS-07 | Missing capabilities not drawn as working | Blocker | P / F |
| CMS-08 | Exactly six navigation sections | Blocker | P / F |
| IDN-04 | Palette proportions | Major | 0 / 1 / 2 |
| IDN-05 | Gold discipline | Major | 0 / 1 / 2 |
| IDN-06 | At least 4 of 6 signature devices on every page type | Major | 0 / 1 / 2 |
| IDN-09 | One palette-only background gradient | Major | 0 / 1 / 2 |
| IDN-10 | Contract ornaments restrained | Major | 0 / 1 / 2 |
| TYPE-04 | At most 8 sizes; steps at least 12% apart | Major | 0 / 1 / 2 |
| TYPE-06 | No text under 12 px; functional text at least 14 px | Major | 0 / 1 / 2 |
| TYPE-07 | Line length 55–75 at 768 and wider | Major | 0 / 1 / 2 |
| TYPE-09 | One h1, no skipped levels | Major | 0 / 1 / 2 |
| SPACE-02 | At most 3 section paddings | Major | 0 / 1 / 2 |
| SPACE-04 | At most 2 alignment axes | Major | 0 / 1 / 2 |
| SPACE-06 | Decoration never touches text | Major | 0 / 1 / 2 |
| WS-01 | Open and dense sections both present | Major | 0 / 1 / 2 |
| WS-02 | No uniform rhythm | Major | 0 / 1 / 2 |
| WS-03 | One dominant element per screen | Major | 0 / 1 / 2 |
| RESP-05 | Primary targets at least 44 px | Major | 0 / 1 / 2 |
| RESP-06 | Image ratios and crop notes | Major | 0 / 1 / 2 |
| RESP-10 | No narrow text columns at 320 | Major | 0 / 1 / 2 |
| A11Y-04 | UI boundaries at least 3:1 | Major | 0 / 1 / 2 |
| A11Y-05 | Text on photos at least 4.5:1 | Major | 0 / 1 / 2 |
| READ-05 | "Not translated" state drawn | Major | 0 / 1 / 2 |
| INT-09 | Credit line on every photo | Major | 0 / 1 / 2 |
| AIT-04 | No decorative gradients | Major | 0 / 1 / 2 |
| AIT-05 | No glass | Major | 0 / 1 / 2 |
| AIT-06 | Radii and pills | Major | 0 / 1 / 2 |
| AIT-07 | Icons functional only | Major | 0 / 1 / 2 |
| AIT-08 | No equal-card section | Major | 0 / 1 / 2 |
| AIT-09 | No centred hero over three features | Major | 0 / 1 / 2 |
| AIT-13 | No default Tailwind palette or copied markup | Major | 0 / 1 / 2 |
| SIMP-03 | Component variants within limits | Major | 0 / 1 / 2 |
| XPAGE-07 | One card pattern per purpose | Major | 0 / 1 / 2 |
| CMS-02 | At least 80% of sections use existing blocks | Major | 0 / 1 / 2 |
| CMS-03 | Max-length fixtures fit | Major | 0 / 1 / 2 |
| CMS-06 | No rich-text dependency, or marked NEW BLOCK | Major | 0 / 1 / 2 |

**Pass threshold (Recommendation):** 0 Blocker fails **and** a Major score of at least 80% of the maximum (2 × the 34 Major rows = 68, so at least 55 points), **and** no zero on IDN-06, WS-03 or AIT-08. A concept that fails one Blocker with a local fix may be re-submitted and re-scored once. Between two passing concepts, choose the one with the higher Major score, then the one with fewer Minor issues (§0.1, not scored here). Record the filled table next to the concept.

## 16. Implementation definition of done

A change is done when every box is ticked with evidence (`visual-testing` report in `docs/frontend/qa/`). "Not run" is written as such.

- [ ] `npm run build` passes; no console errors on the routes in R.
- [ ] Network: zero third-party requests, zero TTF/OTF, no failed requests (PERF-10, PERF-04).
- [ ] Matrix 320 / 375 / 768 / 1024 / 1280 recorded; S1 passes on every route; masked-overflow test passes (RESP-01).
- [ ] Header sweep in Kazakh at the widths of RESP-02 passes (S9).
- [ ] Kazakh glyph page (GLYPH and uppercase) checked in every face and weight used; `LONGNAME` unbroken at 320 (TYPE-02, TYPE-11, S5).
- [ ] S2 font census shows at most 8 sizes; G3 shows zero literals and zero under 12 px (TYPE-04 to TYPE-06).
- [ ] S4/axe: zero contrast failures in both themes and 3 languages (A11Y-03); no gold text on light surfaces (A11Y-02).
- [ ] Keyboard script passes: skip link, language, theme, search, map, filter, dialogs; focus ring visible in both themes (A11Y-06, A11Y-07, A11Y-10).
- [ ] G10 is clean: no `onClick` on non-interactive elements, no navigation buttons, no `href="#"` (A11Y-08).
- [ ] Reduced motion emulated; carousels do not advance over 12 s; every carousel has a pause control or no auto-advance (MOT-03 to MOT-05).
- [ ] Both themes and kk / ru / en reviewed on every route in R (XPAGE-11); `html lang` and title change (A11Y-13).
- [ ] "Not translated" state shown on ru and en for a kk-only page (READ-05); chrome fully translated (READ-06).
- [ ] Content: G14 and G15 clean; every number has a source; every image has a kind, a credit and a provenance record (INT-01 to INT-10); `content-guard` run.
- [ ] CMS: mapping table attached; no new hard-coded editable content (CMS-01, CMS-04); max-length fixtures pass (CMS-03).
- [ ] Scanner: P0 = 0 and P1/P2 within budget (G25, AIT-01 to AIT-03).
- [ ] Design-system drift: G2 legacy count 0; G5 breakpoints ≤ 3; G6 z-index ≤ 6; G7 `!important` ≤ 5; G12 one icon package; G20 no new dependencies.
- [ ] Performance: Lighthouse mobile on home and one article; CLS ≤ 0.1; image and font budgets (PERF-01 to PERF-09), measured and recorded.
- [ ] A reviewer ran `frontend-review` on the diff; findings referenced by criterion ID.

## 17. Open questions and thresholds I am unsure about

| # | Topic | Question or uncertainty |
|---|---|---|
| 1 | Body size | Skills say 16/15 px; `FINAL.md` §3.5 says 18 px or larger. I made 16/15 the Blocker and 18/17 the Recommendation. Owner to choose. |
| 2 | Gold text token | `--accent-gold` fails on light surfaces (2.90). Proposed `--accent-text` (ink, or `#7A5F22`) needs approval. |
| 3 | Contract ornaments | Annex 1 requires parchment texture, dombra silhouette and national ornament; the skill rejects faux textures. IDN-10 allows one of each at low contrast. Needs the owner's reading of the contract. |
| 4 | Background gradient | Contract requires a gradient; the client's stops are unknown. IDN-09 stops are mine. |
| 5 | Dark canvas | `#07130E` is not in the client table. Recommend `#0B1C15`. |
| 6 | Error and success colours | The brief forbids new hues; forms need an error state. Until decided, errors use icon, text and ink. A single dedicated error hue for forms and admin would be an exception the owner has to grant. |
| 7 | Font file size | PERF-03 (300 KB) assumes the final family is one variable woff2 with Cyrillic subsetting. Literata is not approved and its size is not measured. |
| 8 | JS and CSS budgets | PERF-01 (180 KB gzip) and PERF-02 (40 KB gzip) are not measured. Run one production build and adjust. |
| 9 | LCP | PERF-09 depends on hosting; Vercel today, a VPS later. |
| 10 | Scanner budget | AIT-02 (P1 ≤ 5) is my target against a baseline of 15. |
| 11 | Scorecard threshold | 80% Major and the three no-zero rows are proposals. |
| 12 | Palette proportions | IDN-04 percentages (55%, 8%, 70%, 10%) are proposals. |
| 13 | Radii | AIT-06 caps controls and cards at 8 px; the client has not set a radius rule. |
| 14 | Type scale | The 7-step sizes in §2 are proposals. |
| 15 | Section padding tokens | The three `--section-space-*` clamp values are proposals. |
| 16 | Canon titles | Names such as «101 Күйші каноны» contain numbers that the data does not back (9 records). Confirm whether they stay as proper names. |
| 17 | Header collapse | The nav may need to collapse near 1100–1280 px in Kazakh, which differs from the skill's 768 px menu rule. RESP-02 follows the content. |
| 18 | Sections | The audit open question remains: where does "contacts" go inside six sections (XPAGE-04)? |

## Appendix A. Scripts (run in `javascript_tool` or DevTools console)

**S1 overflow (and masked overflow)**
```js
({ scrolls: document.documentElement.scrollWidth > innerWidth,
   outside: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
     return r.width && s.visibility !== 'hidden' && s.position !== 'fixed' && !e.closest('[aria-hidden="true"],[hidden]') && (r.right > innerWidth + 1 || r.left < -1); })
     .map(e => e.tagName + '.' + e.className).slice(0, 20) })
```

**S2 font-size and family census**
```js
const m = new Map(); document.querySelectorAll('body *').forEach(e => { if ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) { const s = getComputedStyle(e), k = parseFloat(s.fontSize) + ' ' + s.fontFamily.split(',')[0]; m.set(k, (m.get(k) || 0) + 1); } }); [...m].sort()
```

**S3 touch targets** (change 44 to 24 for RESP-04)
```js
[...document.querySelectorAll('a[href],button,input,select,textarea,[role=button]')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.width < 44 || r.height < 44) && !e.closest('p'); }).map(e => e.outerHTML.slice(0, 70))
```

**S4 contrast ratio**
```js
const L = h => { const c = [1,3,5].map(i => parseInt(h.slice(i, i+2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126*c[0] + .7152*c[1] + .0722*c[2]; };
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return ((x + .05) / (y + .05)).toFixed(2); };
cr('#A9853C', '#F2EBDD')   // expect 2.90
```

**S5 split words** (a word of 4+ characters spanning two lines)
```js
const bad = new Set(); document.querySelectorAll('main *, header *, footer *').forEach(el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const re = /\S{4,}/g; let m; while (m = re.exec(n.textContent)) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); if (r.getClientRects().length > 1) bad.add(m[0]); } } }); [...bad]
```

**S6 section padding census** (adjust the selector to the section element)
```js
[...document.querySelectorAll('main section')].map(s => { const c = getComputedStyle(s); return [c.paddingTop, c.paddingBottom, Math.round(s.getBoundingClientRect().left)].join(' / '); })
```

**S7 equal-width sibling groups** (3 or more siblings of equal width)
```js
[...document.querySelectorAll('main *')].filter(p => p.children.length >= 3 && new Set([...p.children].map(c => Math.round(c.getBoundingClientRect().width / 2))).size === 1 && p.children[0].getBoundingClientRect().width > 120).map(p => p.tagName + '.' + p.className + ' x' + p.children.length)
```

**S8 layout shift**
```js
let cls = 0; new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => console.log('CLS', cls), 5000)
```

**S9 header fit**
```js
({ wide: document.querySelector('header').scrollWidth > document.querySelector('header').clientWidth,
   clipped: [...document.querySelectorAll('header a, header button, header input')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.left < 0 || r.right > innerWidth + .5); }).map(e => e.textContent.trim() || e.getAttribute('aria-label')) })
```

**S10 distorted images**
```js
[...document.images].filter(i => i.naturalWidth && getComputedStyle(i).objectFit === 'fill' && Math.abs(i.clientWidth / i.clientHeight / (i.naturalWidth / i.naturalHeight) - 1) > .01).map(i => i.src)
```

S11 `[...document.images].filter(i => !i.hasAttribute('alt')).length`. S12 `[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 40))`. S13 `document.documentElement.lang + ' | ' + document.title`.

## Appendix B. Commands (repo root, bash; read-only)

| Code | Command | Baseline |
|---|---|---|
| G1 | `grep -c "@font-face" client/src/styles.css` and `grep -rhoE "font-family:[^;]+" client/src --include=*.css --include=*.jsx \| sort \| uniq -c \| sort -rn` | 13 rules, 9 families |
| G2 | `grep -rnE "#[0-9a-fA-F]{3,8}\b\|rgba?\(" client/src --include=*.css --include=*.jsx` (ignore the token blocks); legacy: `grep -rnE "var\(--(terra\|plum\|wine\|ochre)\)\|#4a2d27" client/src \| wc -l` | 235 hex lines, 189 rgba lines, 171 legacy uses |
| G3 | `grep -rnE "font-size:\s*[0-9.]+px" client/src --include=*.css \| wc -l`; small: `grep -rnE "font-size:\s*(8\|9\|10\|11)(\.[0-9]+)?px" client/src --include=*.css \| wc -l` | 217; 59 at or below 12 |
| G4 | `grep -rnE "(margin\|padding\|gap)[a-z-]*:\s*[^;]*[0-9]px" client/src --include=*.css \| grep -v "var(--" \| wc -l` | 612 |
| G5 | `grep -rhoE "@media[^{]+" client/src --include=*.css \| sort \| uniq -c` | 11 widths |
| G6 | `grep -rhoE "z-index:\s*[0-9]+" client/src --include=*.css \| sort \| uniq -c` | 15 values, max 999999 |
| G7 | `grep -rc "!important" client/src --include=*.css` | 47 |
| G8 | `grep -rhoE "border-radius:\s*[^;]+" client/src --include=*.css \| sort \| uniq -c \| sort -rn` | 12–28 px, pills |
| G9 | `grep -rnE "backdrop-filter" client/src \| wc -l`; `grep -rnE "(linear\|radial\|conic)-gradient" client/src --include=*.css \| wc -l` | not counted per rule |
| G10 | `grep -rnE "<(div\|span\|article\|li)[^>]*onClick" client/src --include=*.jsx`; `grep -rnE "href=\"#\"" client/src --include=*.jsx`; `grep -rnE "order:" client/src --include=*.css` | several |
| G11 | `grep -rnE "outline:\s*(none\|0)" client/src --include=*.css` | several |
| G12 | `grep -rhoE "from '(react-icons[^']*\|lucide-react\|@heroicons[^']*)'" client/src \| sort \| uniq -c` | 4 sets |
| G13 | `grep -rnE "setInterval\|lenis\|infinite\|transition:\s*all" client/src client/package.json`; durations: `grep -rnoE "(transition\|animation)[a-z-]*:[^;]+" client/src --include=*.css` | 2 carousels, Lenis present |
| G14 | `grep -rnE "localStorage\.setItem\|alert\(\|window\.(prompt\|confirm)\(" client/src` | 1 form, native dialogs in admin |
| G15 | `grep -rniE "[0-9]+\+\|[0-9]+%\|ISBN\|аудио ?гид\|audio ?guide\|QR-гид\|жеке QR\|онлайн оқу" client/src --include=*.jsx --include=*.js` | many |
| G16 | `grep -rnE "['\"\`][^'\"\`]*[Ѐ-ӿ][^'\"\`]{40,}" client/src/pages client/src/components --include=*.jsx` | 11 pages |
| G17 | `grep -rnE "word-break:\s*(break-word\|break-all)\|overflow-wrap:\s*(anywhere\|break-word)" client/src --include=*.css` | global rule at `styles.css:257-273` |
| G18 | `grep -rniE "font-family:[^;]*(cursive\|fantasy)\|--font-(brand\|signature\|stamp)" client/src --include=*.css --include=*.jsx` | several |
| G19 | `grep -rnE "(bg\|text\|border\|ring\|from\|via\|to\|fill\|stroke)-(slate\|gray\|zinc\|neutral\|stone\|red\|orange\|amber\|yellow\|lime\|green\|emerald\|teal\|cyan\|sky\|blue\|indigo\|violet\|purple\|fuchsia\|pink\|rose)-[0-9]{2,3}" <concept export dir>` | n/a |
| G20 | `git diff main -- package.json client/package.json` | |
| G21 | `find client/public/images -type f -size +300k` | at least 2 |
| G22 | `grep -nE "url\(.*\.(ttf\|otf)" client/src/styles.css` | 8 |
| G23 | `grep -c "\[data-theme" client/src/styles.css` | 175 |
| G24 | `find client/src -name "*.jsx" -exec wc -l {} + \| awk '$1>300'` | 11 oversize |
| G25 | `node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src` | P0 0, P1 15, P2 15 |
