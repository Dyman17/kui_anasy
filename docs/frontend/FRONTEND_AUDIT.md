Status: draft

# Frontend audit — «Күй анасы» (05.11.2026)

Discovery only. This document describes and diagnoses. It makes no final design decisions; every proposal is labelled **Recommendation** and needs an approved brief before implementation.

Labels used on every claim: **Verified** (seen in the browser or in code, with a reference), **Inferred** (reasoned from evidence, not directly observed), **Recommendation**.

## 0. Scope and method limits

| Item | What was done |
|---|---|
| Live site | Vite dev server `kui-anasy-web` on :5173. The API server was **not** running, so the client used `bundledPages()` from `client/src/defaultPages.js` (`api.js:43-58`). Everything below that comes from "CMS blocks" is therefore the bundled default content, not live database content. |
| Routes visited | `#/kk` (home), `#people`, `#heritage`, `#library`, `#people-kuyshi`, `#projects-alley`, `#projects-monument`, `#projects-muragerler`, `#library-vol-1`, `#about-leadership`, `#about-charter`, `#/ru/people-kuyshi`, `#/en/projects-alley`, `#/nope-page` (404), `#admin` (login screen only). `#projects`, `#about`, `#people-zhyrau`, `#people-anshi`, `#library-vol-2/3` use the same templates as the visited ones and were read in code only. |
| Viewports | 1280 and 375 for most pages; 768 and 1024 for home and People; light and dark. Viewport reset to desktop at the end. |
| Not possible | No Bash: `detect.mjs` (AI-tell scanner) was **not run**; font file sizes and image byte sizes were **not measured**; counts below come from the Grep tool (lines, not occurrences). No `javascript_tool`: horizontal overflow was judged from screenshots and `read_page`, not `scrollWidth`. The `/` search shortcut did not open the search dialog in my one attempt (not diagnosed; treat as **unverified**). The editor screens (`#admin/pages`, builder, users, audit) were read in code only. |
| Tooling note | Screenshots lag 1–2 s after scroll or navigation because of Lenis smooth scroll; every screenshot cited was re-taken after a wait. |
| Pane scaling | The browser pane is about 800 px wide and scales the emulated viewport. All widths below are emulated CSS widths. |

## Executive summary

1. **Verified.** The visual base is not yet the client's one-typeface, cover-palette identity. The CSS declares 13 `@font-face` rules for 9 families (`styles.css:1-103`), uses at least 6 of them as live display or label roles, and still carries the old wine/terracotta system: 171 `var(--terra|--plum|--wine)` uses, 32 hard-coded `#4a2d27`, wine rgba in gradients and dark-theme overrides.
2. **Verified (P0).** In Kazakh at 961–~1280 px the header overflows. At 1024 px the search, language switch, theme toggle and login button are all clipped off-screen. At 1280 px the theme toggle is half cut off and login is missing. English fits; Kazakh (the default language) does not.
3. **Verified (P0).** On 375 px canon cards, person names break letter by letter ("ҚҰ / РМА / НҒАЗ / Ы…") because the portrait and dates leave a very narrow column. This breaks a hard project rule (names never broken).
4. **Verified (P0).** Named people are shown with images that are not their portraits: stele photographs, book covers, an alley photo, a product shot (`kuishiData.js`, 23 records). On the home page the three "Жобаның басты тұлғалары" bands put Tolegen Kuanyshev, Erzat Zhetibayev and Zhalyn Bauyrzhan over book covers. Rule: no invented portraits.
5. **Verified (P0).** Unverified or fake content is still presented as fact: the filter reads "Барлығы (101)" with 9 küishi records, "321+", "150+", "24 hours", "100%", ISBNs, page counts, bus routes, a "Жеке QR-код" and audio guide that do not exist, a registration form that saves to `localStorage` and then reports success.
6. **Verified (P1).** Two auto-advancing carousels with no pause control: the hero advances every 2 s (`HeroImageRotator.jsx:12-17`), the gallery every 5.5 s and pauses only on mouse hover (`AppleTvMediaGallery.jsx:20-26`). Reduced-motion only shortens CSS transitions; the JS timers keep running.
7. **Verified (P1).** Contrast: `--gold-dark` (#A9853C) is used as text on parchment at **2.90:1** (computed): active nav, secondary CTA, kickers, hero second line, stat band. The dark theme has unreadable banner text on `#people` (dark green text on a dark gradient) and wine-tinted surfaces (`#1f0b13`, `rgba(34,13,21,.8)`).
8. **Verified (P1).** Navigation is built from `<button>` elements (header, footer, breadcrumbs, 8 page templates), not links: no open-in-new-tab, no copyable URL, no crawling. Library volume cards and direction cards are clickable `div`/`article` with no keyboard access. Two of four modals have no dialog semantics, Esc or focus trap.
9. **Verified (P1).** Language handling is incomplete: in EN the footer stays Kazakh, content blocks stay Kazakh, and `#/en/projects-alley` shows "СТЕЛА №01" and "Главные кюи" inside English text. The admin is Kazakh-only.
10. **Verified.** What works: the hash router now has language prefix, 404, document title and `html lang`; the Dina Nurpeisova feature block; the heritage map's accessible markers; the real book covers on volume pages; the mobile menu layout; the dark theme's overall deep-green concept; the admin's honest "rendered from code" flag.

## 1. Route and page inventory

Router: `app/router.js` (hash; `#slug`, `#/ru/slug`, `#admin[/…]`). Dispatch: `App.jsx:231-257`. Unknown slug renders `NotFoundPage` (**Verified**: `#/nope-page`, title "Page not found — Kui Anasy").

| Route (slug) | Shows | Source | Key components | Notes |
|---|---|---|---|---|
| `home` | Hero + photo rotator; Dina Nurpeisova feature; heritage map; stats band; intro with illustration; "Жобаның басты тұлғалары" (3 bands); alley gallery; leaders grid (again); Muragerler promo; library callout | **Mixed.** CMS blocks supply text for hero description, feature, stats, quote, cards. Hard-coded: `HERO_SLIDES`, `ALLEY_GALLERY`, `PROJECT_LEADERS`, `MURAGERLER_FEATURES`, the three book-cover images by index (`HomePage.jsx:130`), tooltips | `HomePage` (234 lines), `HeroImageRotator`, `HeritageMap` (341 + 424 css), `AppleTvMediaGallery` (294), `Callout`, `ReferenceTooltip` | 9 sections. The leaders appear twice (cards block, then `PROJECT_LEADERS`). |
| `people` | Banner, "цифрлық паспорт" explainer, three canon tiles, quote, 3 subpage cards | CMS blocks → `StandardPage` | `StandardPage`, `ContentBlock`, `Callout` | Promises a passport with portrait, teacher, QR code that no page has. |
| `people-kuyshi` / `-zhyrau` / `-anshi` | Banner, search, school filter pills, 2-column master cards, "Толығырақ" modal | **Hard-coded** `CANON_DATA` (`constants/kuishiData.js`, 334 lines) | `CanonPage` (195 lines) | Same banner photo (`dina-monument.jpg`) on all three. |
| `heritage` | One long prose block, 3 tradition tiles, a quote | CMS blocks | `StandardPage` | No audio, notation or children. Dead-end section vs contract ("history of küis, sheet music, audio"). |
| `projects` | Section intro + subpage cards | CMS blocks | `StandardPage` | Not visited; same template as `library`. |
| `projects-alley` | Banner, 4 zones, stele catalogue filtered by region, visitor info | **Hard-coded** (`AlleyPage.jsx`, 336 lines) | `AlleyPage` | Visitor info (address, hours, buses, QR guide) is at the bottom. |
| `projects-monument` | Banner, details of the bronze monument | **Hard-coded** (`MonumentPage.jsx`, 235) | `MonumentPage` | |
| `projects-muragerler` | Banner with 3 anchor buttons, 4 stats, directions, FAQ, schedule, registration form | **Hard-coded** (`MuragerlerPage.jsx`, **796 lines**, 3 languages inline) | `MuragerlerPage` | Form writes `localStorage` (`:431-437`) and uses `alert()` (`:425`). |
| `library` | Intro, three volume tiles, sources block, 3 subpage cards ("7 модуль … Оқу") | CMS blocks | `StandardPage` | Cards are text-only; no covers on the shelf page. |
| `library-vol-1/2/3` | Banner, metadata card with cover, chapters, "online reader" modal (2 sample pages) | **Hard-coded** `VOLUMES_DATA` (`LibraryVolumePage.jsx`, 273) | `LibraryVolumePage` | Real covers. "Reader" shows 2 invented sample pages. |
| `about` | Standard page | CMS | `StandardPage` | Not visited. |
| `about-leadership` | Banner, leader bios with photo | **Hard-coded** (`AboutDedicatedPages.jsx`, 162) | `LeadershipPage` | |
| `about-charter` | "Жарғы": four short paragraphs | **Hard-coded** | `CharterPage` | Not a charter: no documents, no PDF, no legal data. |
| unknown slug | "404 / Page not found" + home button | `NotFoundPage` (14 lines) | | Inside site chrome; footer shown. |
| `#admin[/pages|users|audit|edit/slug]` | Login; page list; builder; editor accounts; audit log | `admin/*` (AdminPanel 591 lines) | | Login only observed. |

**Verified.** 9 of 17 slugs plus 3 volume slugs are rendered by dedicated JSX (the admin lists them in `CODE_RENDERED_SLUGS`, `AdminPanel.jsx:29-33`), so staff edits to them are invisible on the site. ARCHITECTURE_AUDIT's "admin opens no page" claim is outdated: the admin now lists all pages and warns about code-rendered ones (`AdminPanel.jsx:402-406`).

## 2. Navigation and UX

### 2.1 Header, search, language, theme

| Element | Observation | Evidence |
|---|---|---|
| Structure | Brand, six-item nav (Home + five sections), then search, language group, theme toggle, account button; below 960 px nav and language move into a full-screen menu | `Header.jsx:127-284`; css `styles.css:1111-1137` |
| **Overflow (P0)** | Kazakh labels are longer. At 1280 CSS px the theme button sits at the clip edge and login is off-screen. At 1024 px the whole right cluster (search, ҚАЗ/РУС/ENG, theme, login) is invisible. English at 1280 fits. | **Verified**: screenshots `#people`, `#people-kuyshi` (KK, 1280), `#/kk/people` (KK, 1024). `.site-shell` has `overflow-x: clip` (`styles.css:338`), which hides the overflow instead of wrapping it. The only breakpoint is 960. |
| Brand tagline | "ЦИФРЛЫҚ ЭНЦИКЛОПЕДИЯ" at 8.5 px | `styles.css:407-416` |
| Language switcher | Three text pills "ҚАЗ / РУС / ENG", 11.5 px, 4×9 px padding (about 22 px tall). Labels do not name the language in its own script for RU/EN readers. Reaches the URL only if the route already had a prefix (`App.jsx:90`). | `styles.css:526-547`; **Verified** in code |
| Theme | Icon-only toggle; mobile menu names it "Түнгі дала" / "Жарық" (wraps to two lines at 375: **Verified** screenshot) | `Header.jsx:201-208, 450-457` |
| Search | Modal dialog (`role="dialog" aria-modal`), Esc closes, results are buttons to pages, "frequent sections" hints are hard-coded Kazakh. Index is page title + description + block text only: **people, küis and places inside hard-coded pages are not searchable** (CanonPage, Alley, Volumes are not blocks). | `Header.jsx:287-361`; `App.jsx:145-151`. **Verified** in code |
| Account | A "Кіру" (login) button for editors is visible to every reader in the header, and the footer advertises "Басқару / Админ панель" | `Header.jsx:262-270`, `App.jsx:281-285`. **Verified** |
| Search shortcut | `/` or Ctrl+K opens search; the hint is a 12 px mono "/" next to the icon | **Unverified in browser**; code only |

### 2.2 Mobile menu (375)

**Verified.** Full-screen overlay: brand and close at top, six numbered rows (01–06) each with a one-line description, language and theme row, login row, watermark. Clear and thumb-friendly. Problems:
- Only the six sections are reachable. Alley, monument, the three canons, the three volumes are two taps away, with no sub-links (**Verified**).
- Numbers 01–06 carry no meaning (an anti-pattern in the project direction).
- Descriptions repeat unverified counts ("101 күйші, 110 жырау, 110 әнші", "3 томдық", `Header.jsx:110-117`).
- Aria labels in the header are hard-coded Kazakh or Russian ("Навигация мәзірін ашу"), not translated (`Header.jsx:136, 146, 176, 279`).

### 2.3 Breadcrumbs

**Verified.** Present on all dedicated pages and `StandardPage` (9 copies of the same markup: `Alley:241, Library:130, Monument:169, Muragerler:467, Canon:67, About:25,107, Standard:26`), always inside the banner, in 12.5 px mono, using `<button>` and "/" spans, inside a `div.breadcrumb` (no `<nav aria-label>`, no `aria-current`). The home page has none (fine). FINAL.md says "not on all pages": in the current code every sub-page has them.

### 2.4 Footer

**Verified** (`App.jsx:262-291`). Three columns: brand blurb, "Бөлімдер" (only `.slice(0,4)`, so **"Қор туралы" is missing**), "Басқару" with the admin link. Bottom line: copyright and description. Gaps:
- No contact (address, email, phone, socials, press), no foundation legal name or requisites. There is no route for it among the six sections.
- Headings and text are hard-coded Kazakh in every language (**Verified** in the EN 404 screenshot).
- Links are `<button>`; the block is not a `<nav>`.

### 2.5 Moving between people, music, library and monuments

| From → to | How it works today | Dead end or confusion |
|---|---|---|
| Home → people | Hero button "Тұлғалар бөлімі"; Dina block link "Тұлғалар каталогы"; map card button | Fine |
| Map → person | Button sets `sessionStorage('kui-canon-focus')`, navigates to the canon page, opens the card modal (`HeritageMap.jsx:198-200`, `CanonPage.jsx:38-53`) | A person has **no URL** and therefore no QR target. Refresh loses the context. |
| Person → their küis → audio | Küi names are static pills | Nothing is playable; "Музыкалық мұра" has no recordings, so the music section has no music. |
| Person → book volume | None | A küishi is not linked to the volume that contains them. |
| Library shelf → volume | Text cards, `article onClick` | Not keyboard-operable. "7 модуль" is CMS jargon shown to readers (`StandardPage.jsx:59`). |
| Any standard page → bottom | `Callout` "Кітапхананы қарау" | Also shown on the Library page itself, so the CTA points to where you already are (**Verified** `#library`). |
| Alley ↔ monument | Bottom nav "← Жобалар / Дина … монументі →" | OK |
| Library volume → reading | "Онлайн оқу" opens 2 invented sample pages | Presents a reader that does not read the book (see §11). |

Confusing labels (**Verified**): "Қор басшылығы мен ғылыми кеңес" is the title; the nav says "Қор туралы"; "Музыкалық мұра" vs "Тұлғалар"; "Жобаның басты тұлғалары" heads a block that ends with the library CTA (§11).

## 3. Component structure and reuse

| Pattern | Copies | Evidence | Note |
|---|---|---|---|
| Page banner (kicker, h1, lead, breadcrumb) | 9 | See §2.3 | Each page re-writes the markup; `StandardPage` one, dedicated pages another. Banner CSS is declared more than once (`.page-banner` at `styles.css:1234`, `2005`). |
| Modals | 4 | Search (`Header.jsx:287`), mobile menu (`:364`), canon master modal (`CanonPage.jsx:161`), reader modal (`LibraryVolumePage.jsx:220`) | First two have `role="dialog"` and Esc; the last two have neither, no focus management, no scroll lock. |
| Cards | at least 8 kinds | `discover-card`, `leader-card`, `canon-master-card`, `subpage-card`, `mini-card`, `direction-card`, `muragerler-feature-box`, `subpage-stat-card`, tv-gallery item | Different radii, paddings, badge styles. |
| Pills and badges | 10+ | `lang-pill`, `canon-pill`, `work-pill`, `leader-pill-badge`, `muragerler-slogan-pill`, `volume-number-pill`, `tv-gallery-badge`, `master-school-tag`, `page-library-tag`, `popover-role-badge` | Heavy pill vocabulary; radii from 9 px to 999 px (18 lines with ≥90 px or 50 %/100 %). |
| Kicker label | 2 definitions | `.block-kicker` at `styles.css:1276` and `:2233` | Second one wins by cascade; fonts and sizes differ (12.5 vs 13 px). |
| Icon sets | 4 | `react-icons/pi`, `/ri`, `/tb` and `lucide-react` (`Callout.jsx`, admin) | Three-tone duotone vs line icons mixed. |
| Tooltip | 1 component, widely nested | `Tooltip` wraps buttons in a `span tabIndex=0` (`ReferenceTooltip.jsx:17-23`) so a button inside gets two tab stops. | **Verified** in code (`HomePage.jsx:68-72`) |
| Language switcher | 2 copies | desktop `Header.jsx:176-198`, mobile `:428-447` | The mobile copy has no `aria-pressed`. |
| Per-page trilingual copy | inline `CONTENT = {kk, ru, en}` objects | `MuragerlerPage.jsx:~20-403`, `AlleyPage.jsx`, `Library` | Content mixed with layout; no translation gaps are flagged. |

Oversized files (**Verified**, lines): `styles.css` 8132; `MuragerlerPage.jsx` 796; `defaultPages.js` 701; `AdminPanel.jsx` 591; `Header.jsx` 512; `constants/index.js` 392; `HeritageMap.jsx` 341; `AlleyPage.jsx` 336; `kuishiData.js` 334; `App.jsx` 300; `AppleTvMediaGallery.jsx` 294 (it also contains a 100+ line `HERO_SLIDES` constant at `:161` that looks unused). Only two components have co-located CSS (`HeritageMap.css`, `AuditLogView.css`) plus `NotFoundPage.css`.

Inline styles are common in JSX (`App.jsx:272,282,284`; `AdminPanel.jsx:264,327,381,392,496`; `CanonPage.jsx:175,178`; `HomePage.jsx:59,109,167`).

## 4. Visual identity: what it is versus what the client approved

Approved direction (FINAL.md §3, skill): forest green `#10291F`, antique gold `#D7B45F`, parchment `#F2EBDD` from the book cover; one main typeface; calm, documentary, museum-catalogue tone; no gradients for decoration, no glassmorphism, no equal-card grids.

| Aspect | Today | Match |
|---|---|---|
| Palette tokens | `:root` carries the approved values (`styles.css:125-137`) | Yes, in tokens |
| Palette in use | Light theme: parchment, forest rail, gold-dark accents: reads as the cover. But the cascade still holds legacy brown body text (`#4a2d27`, 32×), wine rgba shadows (`rgba(51,0,14,.08)` on `.site-shell` and banners), peach `#f3b29f` kickers on dark blocks, terracotta rgba in banner gradients | Partly |
| Typography | 9 families, 6 in active roles (§5) | **No** (client wants one) |
| Surfaces | `.site-shell` is a 28 px-radius panel with `backdrop-filter: blur(20px)` over a blurred photo mosaic on `body::before`; `.site-header` also blurs (`styles.css:332-345, 355-369, 275-291`). It reads as frosted glass, listed as an anti-pattern | **No** |
| Ornament | 64 px fixed left rail with gold ornament; faint instrument contours, offset instrument outlines drifting across sections; gold section dividers with diamonds | The rail is client-required. The floating outlines are the contemporary contour graphics the skill allows at low contrast. They cross text in places (**Verified**: a kobyz outline touches the Dina block text on home; a dombra outline sits next to the leaders heading). |
| Pill language | Pill CTAs and badges, orbs with icons in circles | Contradicts "no pill-shaped everything" |
| Layout character | Home is a sequence of 9 differently styled sections (good variety) but the leaders grid and Muragerler feature row are the generic "three/four equal cards with icon orbs" the skill rejects | Partly |
| Photography | Real photographs of the alley, monument and stele are strong. The dombra-player "illustration" appears as a painterly full-colour image with the visible caption "КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ" | **Inferred**: it can read as AI-generated, which FINAL.md §3.4 rules out; provenance unknown. |
| Tone | The Dina block, the map and volume pages feel editorial. The Muragerler promo and stat cards feel like a campaign page | Mixed |

**Recommendation.** Treat the Dina block (`featured-person`), the map panel and the volume metadata card as the visual reference for the redesign, and the leaders grid, Muragerler promo, tv-gallery badge and pills as the pieces to replace.

## 5. Typography

### 5.1 Families loaded (Verified, `styles.css:1-103`)

| Family | Files | Used as |
|---|---|---|
| Medeo Sans | variable woff2 normal + italic | body, UI (`--font-body`) |
| Medeo Mono | variable woff2 | captions, breadcrumbs, footer line, mobile nav numbers (`--font-mono`) |
| KTF Jermilov | ttf | h1/h2 headings, stat numerals (`--font-display`) |
| Nauryz Red Keds | ttf | hero first line, card and block titles (`--font-editorial`, `--font-title`) |
| Alistair Signature | ttf | wordmark, hero English tagline, canon filter pills, footer headings, stat labels (`--font-brand`, `--font-signature`) |
| Capture It | ttf | kickers (`--font-stamp`) |
| Playfair Display | ttf ×2 | hero photo caption (`--font-quote`) |
| KTF Jermilov Stencil | otf | a few headings (`--font-stencil`) |
| Roslindale Text | woff2 ×3 | **declared, never referenced** by any rule (Verified: only matches are the `@font-face` blocks) |

13 `@font-face` rules, 9 families. The client's single-typeface rule is not met; Literata is only proposed. File sizes were not measurable here; ARCHITECTURE_AUDIT's "≈2.5 MB uncompressed TTF" is **unverified**. Only variable woff2 files (Medeo) and Roslindale are compressed; the rest are raw TTF/OTF. `client/fonts/` also holds dozens of unused static Medeo Sans/Mono/Pixel files (**Verified** by listing).

Three stray fallbacks reference fonts that are not loaded ('Open Sans', 'Montserrat', `styles.css:7920, 8039, 8072`).

### 5.2 Scale and roles

- **No scale.** Font sizes are set 217 times in px (`font-size: Npx`), 59 of those at or below 12 px, 58 in rem/em/clamp. The h2 clamp ranges alone: 20–28, 26–36, 28–42, 28–44, 30–44, 30–46, 30–54, 32–48, 32–50, 36–58 (**Verified**, `styles.css:1548, 1612, 1738, 1780, 1848, 1912, 2241, 2287, 2342, 7617`).
- **Body** is 16–17 px (`.editorial-block p` 16 px/1.8; hero lead 17 px/1.72), below FINAL.md's "18 px or larger" for older readers. Secondary copy is 12–14 px (`master-bio` 13.5, `leader-bio` 13.5, `volume-chapter-item p` 14, `stat-sub` 12.5, `master-dates` 12, `work-pill` 12).
- **Labels set in a script.** Alistair Signature at 13–15 px is used for functional text: canon school filters (`canon-pill`, `styles.css:7109`), stat labels (`:6243`), footer headings. **Verified** in screenshots: at 375 px the filter labels and the "Белсенді жас өнерпаз" stat label are hard to read.
- **Two display faces in one headline.** The hero h1 mixes Nauryz Red Keds ("КҮЙ анасы.") and Jermilov ("ҰЛЫ ДАЛА ӘУЕНІ.") (**Verified**, `styles.css:1286, 1293`).
- **Uppercase mono and stamp kickers** at 12.5–13.5 px appear above nearly every heading (all-caps labels everywhere is an anti-pattern).
- Hierarchy problems (**Verified**): Muragerler stats use `h4` before any `h2` (`MuragerlerPage.jsx:496-499`); the home Muragerler features use `h4` directly under `h2` (`HomePage.jsx:222`); the admin heading uses `h2` for the login title.

### 5.3 Kazakh glyphs

**Verified** rendering in screenshots, uppercase and lowercase: Қ, Ү, Ұ, Ә, Ғ, Ң, Ө, І in Jermilov headings ("КҮЙ", "ҰЛЫ ДАЛА ӘУЕНІ", "ДИНА НҰРПЕЙІСОВА", "ҚАЗАҚ МУЗЫКА МҰРАСЫНЫҢ"), in the Capture It kickers, Nauryz Red Keds, and lowercase in Medeo Sans body ("Қазақтың… жаңғырт… өнерпаз… Маңғыстау"). Alistair Signature renders Cyrillic and Kazakh letters ("Барлығы", "Жетісу & Шығыс") in script form. **Not verified:** the letter Һ/һ in any display face (no visible occurrence); Alistair's coverage for ә ғ қ ң ө ұ ү of the tagline "Мұраны сақта, жаңғырт, дамыт!" at its tiny size (illegible in the capture). **Recommendation:** run a glyph test page for Һ/һ in every loaded face before choosing the final one.

### 5.4 Names

**Verified.** Names use `word-break: break-word` through the global rule `h1…h6, p… { overflow-wrap: break-word; word-break: break-word }` (`styles.css:257-273`), which allows splitting a name anywhere. The skill requires `white-space: nowrap` plus `clamp()` for names. The 375 px canon card is the failing case (see §8).

## 6. Colour

### 6.1 Tokens versus literals

| Measure | Count | Evidence |
|---|---|---|
| Lines with hex colours | 235 in `styles.css`, 7 in JSX | Grep |
| Lines with `rgb()/rgba()` | 189 in `styles.css` | Grep |
| Legacy token uses `var(--terra|--plum|--wine)` | 171 | Grep |
| `#4a2d27` (wine brown) | 32 | Grep |
| Wine/maroon literals total (`#4a2d27`, `#07130E`, `#33000e`, `rgba(51,0,14…)`, `rgba(74,45,39…)`) | 51 lines | Grep |
| `[data-theme]` selectors | 175 in `styles.css`, 3 in `HeritageMap.css` | Grep |
| `!important` | 47 in `styles.css` | Grep |
| z-index declarations | 45, 15 distinct values from 0 to 999999 | Grep |

ARCHITECTURE_AUDIT quoted 411 literals; the counts above (424 lines) are consistent. The skill's `--accent-gold` (= `--gold-dark`) is the role used for all accent text on parchment.

### 6.2 Contrast (computed from the tokens; WCAG relative luminance)

| Pair | Ratio | Verdict | Where |
|---|---|---|---|
| `--ink` #26372D on `--parchment` | 10.7:1 | pass | body |
| `--ink-muted` #536458 on parchment | 5.3:1 | pass | secondary text |
| `#4a2d27` on parchment | 10.4:1 | pass but off-palette | most body copy |
| FINAL.md "Text Muted" #687568 on parchment | 4.1:1 | would fail; the code correctly uses #536458 | token note |
| **`--gold-dark` #A9853C on parchment** | **2.9:1** | **fail** (normal and large text) | active/hover nav, secondary hero CTA "Музыкалық мұра", every kicker (`--terra`), "ҰЛЫ ДАЛА ӘУЕНІ." (92 px), `.block-kicker`, breadcrumbs' current link |
| `--gold-dark` on `--paper` #E8DFC9 | 2.6:1 | fail | kickers inside paper surfaces |
| `--paper` text on a `--gold-dark` band | 2.6:1 | fail (**Inferred**: band background read as gold-dark from the screenshot; text colour from `styles.css:1555, 1575`) | stats band "Бір мұра. Үш дәстүр." and its 10 px labels |
| `--gold` #D7B45F on `--forest` #10291F | 7.8:1 | pass | dark theme accents |

The skill itself states: never gold on parchment below 4.5:1, use ink. The light theme does the opposite for nav and kickers.

### 6.3 Theme consistency (Verified)

- Dark theme overrides tokens in one block (`styles.css:4757-4792`) but then adds 175 selector-level overrides, many with wine/maroon literals: `rgba(34,13,21,.9)` canon search, `#1f0b13` modal, `#2a101b` buttons, `#fff4f0` and `#d8c2bd` text (`styles.css:7802-7843`). Screenshot at `#/kk/people-kuyshi` (dark): the search box and pills are visibly burgundy against the green canvas.
- `#people` dark, 1024 and 1280: the page banner's title is gold-dark on a dark gradient and the lead paragraph is dark green over a dark overlay (the text colours are tied to `--plum`/`#4a2d27`, which stay dark). **Unreadable** (Verified screenshots).
- Dark canvas is a flat `#07130E` (not in the palette table; forest-deep is `#0B1C15`). FINAL.md §3.3 asks for a gradient; the exact stops are an open client question.
- The light background gradient is a parchment overlay over a blurred, multiplied photo mosaic (`body::before`, `styles.css:275-291`): a decorative blur layer under all content.

## 7. Spacing and layout

| Measure | Finding |
|---|---|
| Spacing tokens | `--spacing-xs … xxl` exist (`styles.css:168-173`) and are used **once** (`var(--spacing-`: 1 in `styles.css`, 4 in `NotFoundPage.css`). 612 lines hard-code px spacing. **Verified** |
| Widths | `.site-shell` max 1280 incl. the 64 px rail; `.content-width` = `min(1040px, 100% − 140px)` (`styles.css:347`). Result: 1040 px content inside a 1216 px shell, so side margins are 88 px per side, plus the shell's own radius and border. Page banners use the same width with `margin-inline: auto !important`. |
| Measure | Body paragraphs max 590–600 px at 16–17 px, roughly 60–70 characters in Kazakh: acceptable. **Verified** screenshots |
| Breakpoints | `styles.css`: 480, 600, 640, 680, 681 (min), 768, 820, 900, 960, 1024, 1050 = **11 distinct** (22 `@media` blocks); `HeritageMap.css` 900/640; `AuditLogView.css` 640. Home header switches at 960 but content grids at 1024/1050/820/900/768 (different components, different widths). |
| Radius | 12 px, 14, 20, 28 px shell, pills (20/50 %/999). No single system. |
| Alignment | Floating instrument outlines overlap headings and text on home (Dina block, leaders heading) and `section-topline` links; the left-rail margin and content margin differ per section (Verified in screenshots). |
| Rhythm | Home alternates dense (map, stats band) and open (hero, intro): good. Spacing between sections is set per section rather than by token. |

## 8. Responsive behaviour (per page)

| Page | 375 | 768 / 1024 |
|---|---|---|
| Home | **Verified.** Hero stacks, photo below headline, CTAs full width: good. Map shows points without labels (tiny targets); list below is the real control. Rail drops to 28 px. | 768 dark: header collapses to icons, hero and photo stack, clean. 1024 KK: header overflow (P0). |
| People (standard) | Not captured at 375 (same banner template as others). | 1024 KK dark: banner title and lead unreadable; right header cluster missing. |
| Canon pages | **Verified, P0.** Master card is 2-column (portrait + header); the name column is about 70 px wide: "ҚҰ РМА НҒАЗ Ы САҒ ЫРБ АЙҰ ЛЫ". Search placeholder is cut ("…шығармасы бой"). Filter pills are small script text that wraps to three rows. | 1280: two-column cards, readable. |
| Alley | Not captured at 375; code uses the shared banner and cards. | 1280 fine. |
| Muragerler | **Verified.** Banner image is cropped to a gold-orange gradient; three action buttons stack; stat cards are two-up with script labels ("Белсенді жас өнерпаз") that are hard to read; "150+" in a thin italic script. | |
| Library volume | **Verified.** Cover, metadata and two-column meta pairs work; "ISBN 978-601-…" wraps. | |
| Mobile menu | **Verified.** Works; theme button label wraps to two lines. | |
| 404 | Not captured at 375. | |
| Admin login | Not captured at 375. | |

**Not tested:** 320 px; landscape phone; every page at 768. **Inferred:** the same narrow-column risk appears on any card with a fixed-width portrait (Library "subpage-card", `leader-card`).

## 9. Accessibility

| Topic | Finding | Evidence |
|---|---|---|
| `html lang` | Updated per language (`kk/ru/en`) and `<title>` per page | `useDocumentMeta.js`; title changes **Verified** in tab context. `index.html` has `lang="kk"`. |
| Headings | Home h1 then h2/h3, but h4 appears under h2 (skips h3) and before h2 on Muragerler; banner `h1` per page | §5.2 |
| Landmarks | `header role="banner"`, `main`, footer, desktop `nav aria-label`. Footer links not in a `nav`. Breadcrumb is a plain `div`. Left rail is `aside aria-hidden`. | `Header.jsx:127,146`, `OrnamentRail.jsx` |
| Links vs buttons | Navigation uses `<button onClick>`; `<a href="#">` for the brand with `preventDefault`. Hash routes are not exposed as hrefs except gallery items and the footer admin link. | **Verified** `Header.jsx:129-143,150`, `App.jsx:275` |
| Keyboard | Clickable `article.subpage-card` (`StandardPage.jsx:56`) and `div.direction-card` (`MuragerlerPage.jsx:515`) are not focusable. | **Verified** code |
| Focus ring | Global: 2 px `--terra` (gold-dark) outline, 3 px offset (`styles.css:308-315`), fine. Removed without a visible replacement for `.search-modal-input`, `.canon-search-box input`, the hover names (`name-ref-hoverable:focus-visible { outline: none }` changes colour only), and the form field at `:6579`. | **Verified** |
| Dialogs | Search and mobile menu: `role="dialog" aria-modal="true"`, Esc closes, body scroll locked; **no focus trap, no focus return**. Canon modal and library reader: plain divs, no Esc, no `aria-modal`, no labelled title, close button is a bare "✕". | **Verified** `Header.jsx:40-46,287-293,364-370`, `CanonPage.jsx:161-184`, `LibraryVolumePage.jsx:220-262` |
| Carousels | Hero rotates every 2 s, loops with cloned slide, has `role="tablist"` dots without `tabpanel`s; there is no pause, stop or hover pause. Gallery rotates every 5.5 s, pauses only on mouse enter (not focus or touch), `ul role="list"` containing `li role="tabpanel"` (invalid), no pause button. | **Verified** `HeroImageRotator.jsx:12-17,109-123`, `AppleTvMediaGallery.jsx:20-26,65-77` |
| Reduced motion | CSS block sets transitions/animations to .01 ms (`styles.css:4258-4267`) and Lenis is not started (`main.jsx:7-21`). JS timers still advance slides. | **Verified** |
| Alt text | Hero rotator and gallery images have meaningful alt. Decorative `alt=""` is used on banner images and book covers on the home "cards" (these are the information carriers there). Canon images use `alt={name}` even though they are not that person. | **Verified** |
| Tooltips | CSS `data-tooltip` shown on hover/focus; `Tooltip` makes a span focusable around a button (double tab stop). Historical name cards are `role="tooltip"` spans with long bios (30–60 words) revealed on hover only. **Inferred:** on touch they rely on a tap focusing the span; not tested. | `ReferenceTooltip.jsx` |
| Touch targets | Language pills about 22 px tall, header icon buttons 35–38 px, map markers tiny at 375, canon pills about 32 px, "✕" buttons. Client wants "large tap targets" for older readers. | **Verified** css values |
| Colour contrast | §6.2 | |
| Live regions | Heritage map panel has `aria-live="polite"`; the search results and the canon filter result count do not. | **Verified** |
| Error handling | `alert()` for form validation in Muragerler (`MuragerlerPage.jsx:425`). | **Verified** |

## 10. Motion and interaction

| Item | What it does | Purpose? |
|---|---|---|
| Lenis smooth scroll (`main.jsx`) | Wheel smoothing, 1.1 s, started globally (disabled with reduced motion). `html { scroll-behavior: smooth }` also set. | **Inferred:** decoration. **Verified** side effects in this audit: after every scroll or navigation the viewport lagged 1–2 s behind; the Header also locks body scroll by `overflow:hidden`, which Lenis does not know about (**Inferred**, ARCHITECTURE_AUDIT proposes removing Lenis). Older readers and screen-reader users get no benefit. |
| Hero rotator | Slides every 2 s, cloned-slide loop, caption cross-fade | Shows more of the alley, but 2 s is too fast to read a caption or click; no pause. |
| tv-gallery ("Apple TV") | 8 slides, 5.5 s autoplay, arrows, dots, swipe | Gallery of alley zones; autoplay unnecessary. The name and `data-analytics-*` attributes are copied from Apple's markup (`AppleTvMediaGallery.jsx:55-58`), which the brief warns against (no brand copying). |
| Map | Slow smooth zoom to a region (client requirement); markers are keyboard buttons; reduced-motion handled in `HeritageMap.css:418` | Meaningful. **Preserve.** |
| Section reveal, hover lifts | Some hover transforms on cards; not examined in detail | **Unverified** |
| Link hover | Underline reveal on nav; colour changes to gold-dark (fails contrast) | |

## 11. Content presentation

### 11.1 People, küi, places, books

- **People (canon cards)**: two-column cards with a 60–70 px portrait tile, name in display face, dates, region, bio clamped to 3 lines, küi pills, a "Толығырақ" button that opens a modal that repeats the same bio. 23 records in total (9 küishi, 7 zhyrau, 7 anshi — corrected by architect review, `kuishiData.js` `id:` lines 19–107, 160–226, 253–319; from the 23 `img:` entries in `kuishiData.js`). **No portraits** (§ P0 evidence): Kurmangazy shows an archival colour print of a group, Dauletkerei the marble stele, Tattimbet the "Күй әлемі" book cover, Sugir a painted old man, Dina the monument photo.
- **Küi**: names only as pills; no duration, no recording, no notation, no source.
- **Places**: alley and monument pages are photo-led and good, but the practical block (address, hours, bus numbers, QR guide) is last. **Inferred:** QR visitors standing at a stele need that block and the stele's own person first.
- **Books**: real covers on volume pages; the library shelf page has none. Cover of vol. 1 reads "КҮЙ ӘЛЕМІ · 100 КҮЙШІ" while all copy says 101 (**Verified**, screenshot vs `VOLUMES_DATA`).
- **Quotes**: `ContentBlock` adds «» around block bodies that already contain «»; the heritage page shows `««…».»` (**Verified** `#heritage`, `ContentBlock.jsx:16`).

### 11.2 Fake or non-working UI, unverified numbers (Verified unless marked)

| Item | Where | Issue |
|---|---|---|
| Registration form | `MuragerlerPage.jsx:422-444, 633` | Writes to `localStorage` on the visitor's own browser, then shows success. No server endpoint. |
| "Онлайн оқу" reader | `LibraryVolumePage.jsx:139, 220-262` | Shows two invented sample pages (text written for the site) in a "book" chrome. Not the book. |
| Stats "150+", "4", "24", "100%" | `MuragerlerPage.jsx:30-35`, CMS `defaultPages.js:657` | Unsourced. FINAL.md §6.6 flags them. |
| "321+", "101 / 110 / 110" | `defaultPages.js:32`, `constants/index.js:219`, home stats band | Canon has 9 / 9 / 5 records; "Барлығы (101)" is hard-coded on the filter (`kuishiData.js:11`). |
| ISBN, "512 бет", "ҚР ҰҒА академиктері" | `LibraryVolumePage.jsx:22-27` | Unsourced. |
| Bus routes, 24/7, "Стела №" numbers | `AlleyPage.jsx:86, 155` | Unsourced (FINAL.md §6.6). |
| "Интерактивті QR-гид … аудиожазбасы" | `AlleyPage.jsx:87` | No QR codes per stele are shown on the site and no audio exists. |
| "Жеке QR-код", "Аудио/бейне жазбалар" in the People passport text | CMS block on `people` | Features that do not exist on any person. |
| "үш тілде" (3 languages) edition; archive claims | `library` page text | Content is Kazakh only for the site; archive sources unverified. |
| Tooltip bios | `ReferenceTooltip.jsx:30-109` | 13 biographical entries with dates and claims, hard-coded in code, no source. Needs `content-guard`. |
| Illustration caption "АТРИБУЦИЯ ЖОҚ" | home `intro-artwork` | The page itself admits no attribution. |
| Download link on volume pages | `LibraryVolumePage.jsx:143-151` | "Мұқабасын жүктеу" downloads the cover JPG; label is honest, but the CTA row suggests the book. |

No `<audio>` or `<video>` element exists anywhere (**Verified**, grep). The "Үлгі тыңдау" buttons reported in ARCHITECTURE_AUDIT are gone.

### 11.3 Home duplication

**Verified.** The home page has two leader sections: the three bands titled "Жобаның басты тұлғалары" (from the CMS `cards` block, `HomePage.jsx:117-141`, book-cover image chosen by index, link label "Кітапханаға өту") and the `PROJECT_LEADERS` grid of three cards. The same three names appear twice, and the first set is visually a book shelf.

### 11.4 AI-design tell scan

Not run (no Bash). **Inferred** from reading: the following patterns the scanner normally flags are present: frosted-glass shell (`backdrop-filter`: 58 gradient/blur lines in CSS), icon orbs, pill badges, equal 3- and 4-up card rows, numbered 01–06 menu, all-caps mono/stamp kickers, a gradient banner per section.

## 12. Admin UI

(Code reading plus the login screen. Not run past login.)

| Area | Observation |
|---|---|
| Auth | **Verified** at `#admin` (1280): centred card "Басқару жүйесі" with two role tabs "Бас әкімші / Редактор / Әкімші"; Super Admin asks for the "Master Secret Key" in a password field and explains the env variable in 12 px helper text; editor has login and registration. Submit buttons are disabled when the API is not enabled (`AuthView.jsx:111,151`). Different frame from the public site (no rail), same brand tokens. The entry point is public (header and footer). |
| Language | Kazakh only, hard-coded (`AdminPanel.jsx`, `AuthView.jsx`). Page list shows `page.parent_slug || 'Тұлғалар'` as a tag; a null parent shows "Тұлғалар" (**Verified** `AdminPanel.jsx:393`). |
| Page list | Status filter tabs, bulk select and approve, status badges, author/approver lines with emoji (👤 ✏️ 📝 ✅, `AdminPanel.jsx:410-417`), per-page edit. Honest "rendered from code" notice for 12 pages. Heavy inline styling. |
| Block editor | Left sidebar of block types, right canvas, up/down/delete per block, live preview using `StandardPage`, change-summary field for the audit log. Block types limited to text, heading, quote, stats, cards, callout, list, image (URL field only), qr. **No audio, video, upload, person, language tabs.** A block's "alt text" label exists for images. |
| Preview | Uses the public `StandardPage` with `UI_TRANSLATIONS.kk`: faithful for CMS pages, meaningless for the 12 code-rendered ones. |
| Moderation | Editors send for review, super admin approves/rejects (`window.prompt` for reason, `window.confirm` for deletion: native dialogs). Editor accounts list with approve/delete. |
| Audit log | `AuditLogView` with action labels, change descriptions, 100 per page, own CSS, responsive at 640. Not seen live. |
| Visual state | Functional and legible, not decorative: consistent with "Admin: functional" in the skill. Uses `lucide-react` (4th icon set). |

**Recommendation.** Admin only needs: Kazakh/Russian labels, a native `<dialog>` for reject/delete instead of prompt/confirm, removal of emoji and inline styles, and tab order checks. No redesign is needed before the contract features (media, translations) land.

## 13. What works and should be preserved

1. **Dina Nurpeisova feature block** on home: a full-bleed photograph next to a deep-green panel, display-face name, linked tooltips; it already carries the client's palette and an editorial feel (**Verified** screenshot).
2. **Real photography and the alley/monument pages**: the arch, stele, monument and book cover photographs, and the page order concept "banner → zones → catalogue" (needs re-ordering only).
3. **Heritage map**: schematic Kazakhstan outline, keyboard-operable markers (`role="button"`, `aria-pressed`, `aria-label`, `aria-live` panel), honest empty regions ("being compiled"), reduced-motion branch, co-located CSS.
4. **Hash router + document meta**: language prefix, 404, title and `html lang` (**Verified** working in browser); also back/forward land at top.
5. **Mobile menu structure**: full-screen, large rows, description lines, utilities at the bottom; and the dark theme concept ("Түнгі дала": deep green, gold) which already looks right on home at 375 and 768.
6. **Volume metadata card** (cover + facts + chapters) and the CMS model "page = ordered blocks" plus the admin's honest code-rendered flag.
7. **Left ornament rail** (client-required) and the dombra/kobyz outline vocabulary used sparingly.
8. **Single global focus ring** and `prefers-reduced-motion` CSS branch, as a starting point.

## 14. Problems ranked

| # | Pri | Problem | Evidence |
|---|---|---|---|
| 1 | **P0** | Header overflows in Kazakh at 961–~1280 px; search, language, theme and login unreachable at 1024 | Screenshots `#/kk/people` 1024, `#people` 1280; `styles.css:338, 1111` |
| 2 | **P0** | Person names broken letter by letter on 375 px canon cards | Screenshot `#/kk/people-kuyshi` 375; `styles.css:257-273` |
| 3 | **P0** | Non-portrait images (stele, books, alley, product) shown as the portraits of named people; leader bands use book covers | `kuishiData.js:27-327`; `HomePage.jsx:130`; screenshots |
| 4 | **P0** | Fake or unverified claims presented as fact: registration form with success message that stores nothing; "Онлайн оқу" with invented sample pages; "Барлығы (101)" over 9 records; "321+", "150+", "100%", ISBN, 512 pages, bus numbers, QR guide with audio, "Жеке QR-код" | §11.2 |
| 5 | **P1** | Auto-advancing carousels (2 s and 5.5 s) with no pause; invalid tab semantics; JS ignores reduced motion | `HeroImageRotator.jsx:12`, `AppleTvMediaGallery.jsx:20` |
| 6 | **P1** | Accent text fails contrast on parchment (2.9:1): active nav, kickers, hero line 2, secondary CTA, stat band (2.6:1) | §6.2 |
| 7 | **P1** | Dark theme: banner title and lead unreadable; wine/burgundy surfaces off palette; 175 per-component overrides; flat background | Screenshots `#/kk/people` and `#/kk/people-kuyshi` dark; `styles.css:7802-7843` |
| 8 | **P1** | Typography: 9 families, 6 live roles, scripts for functional labels at 13–15 px, body 16–17 px, 59 sizes ≤ 12 px, 10 different h2 scales | §5 |
| 9 | **P1** | Navigation, breadcrumbs, footer links are `<button>`s; clickable non-focusable cards; two modals without dialog semantics, Esc or focus trap; focus ring suppressed on inputs | §9 |
| 10 | **P1** | 12 of 17 pages are code-rendered; admin edits do not appear (contract §1.3) | `App.jsx:235-257`, `AdminPanel.jsx:29-33` |
| 11 | **P1** | Trilingual gaps: EN/RU shows Kazakh footer and content; "СТЕЛА №" and "Главные кюи" in EN; aria labels fixed in kk/ru; admin Kazakh only | `App.jsx:269-284`, EN `#/en/projects-alley` |
| 12 | **P2** | Frosted shell (`backdrop-filter`), pills and orbs, equal card rows (leaders, Muragerler features, tv-gallery badge) against the direction | §4 |
| 13 | **P2** | Home repeats the three leaders; heritage quote shows doubled «» marks; "7 модуль" jargon; Callout "view library" on the Library page | §11 |
| 14 | **P2** | Lenis smooth scroll adds lag and conflicts with scroll-locked dialogs; `scroll-behavior: smooth` also on | `main.jsx`; observed lag |
| 15 | **P2** | Footer lacks contact and the About link; public login and admin pitch in footer | `App.jsx:262-291` |
| 16 | **P2** | CSS debt: 8132 lines, 47 `!important`, 15 z-index values to 999999, 11 breakpoints, spacing tokens used once, 171 legacy token uses, duplicated `.page-banner` and `.block-kicker` | §6-7 |
| 17 | **P2** | Alley page order buries the practical information QR visitors need | §11.1 |
| 18 | **P2** | Illustration with "атрибуция жоқ" and AI-like look; map labels vanish at 375; touch targets under 44 px | §4, §8, §9 |
| 19 | **P3** | Unused: Roslindale `@font-face` ×3, dozens of font files, `HERO_SLIDES` copy, three icon sets; `Open Sans`/`Montserrat` fallbacks; `Tooltip` double tab stops | §3, §5 |
| 20 | **P3** | Admin emoji and inline styles, native `prompt/confirm`; Kazakh-only admin | §12 |

## 15. Verification of ARCHITECTURE_AUDIT (04.11) claims

| Claim | Status today |
|---|---|
| CSS monolith "8270 lines" | **8132** lines now. |
| 13 `@font-face`, 8 typefaces | 13 rules confirmed. Count is 9 families including Roslindale (declared, unused). |
| 47 `!important` | Confirmed (47). |
| 11 breakpoints | Confirmed (11 distinct). |
| 16 z-index values to 999999 | I count 15 distinct values up to 999999. |
| 411 colour literals, `--terra` ×107, `--plum` ×73 | Colour literal lines 424; legacy tokens 171 in total; consistent. |
| Admin opens no existing page | **Fixed**: lists all, flags code-rendered ones. |
| Router: empty hash, unknown slug → `pages[0]`, no title/lang | **Fixed** (404, meta, `html lang`). |
| Search query leaks into content | **Fixed**: `StandardPage` has no `query` prop. |
| Fake audio buttons | **Fixed** (none found), but the Alley copy still promises audio. |
| Modals: 4, two without semantics | Confirmed. |
| Two icon libraries | Four icon sets in practice (3 react-icons packs and lucide). |
| Dead `HERO_SLIDES` | A copy remains in `AppleTvMediaGallery.jsx:161`. |
| Registration form saves to `localStorage` | Confirmed. |
| 12 of 17 pages hard-coded | Confirmed for the listed slugs. |

## 16. Open questions for the owner

1. Is the Kazakh header allowed to drop items (for example search into the menu) between 961 and 1280, or should the breakpoint move?
2. Which real portrait sources exist for the 23 canon records? Until then, should cards render without images?
3. Which of the statistics (§11.2) are confirmed by the client?
4. Is the dombra-player image supplied by the client or produced by AI? FINAL.md §3.4 forbids the latter.
5. Is Literata approved? Glyph test for Һ/һ in the final face is still open.
6. What should the "contacts" entry be, given the six-section rule?
7. Dark-theme gradient stops (FINAL.md Q8).

## Appendix A. Measurements added by the main session (05.11.2026)

The designer agent had no shell access. These numbers were measured afterwards with Bash. All are **Verified**.

**AI-design tell scanner** (`node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src`): 30 findings, P0 0 · P1 15 · P2 15.
- P1 by rule: I3 worn Lucide set ×5, CP3 arrow glyph welded to a CTA ×3, and one each of SD5 one accented headline word, SD4 tracked all-caps labels, SD2 near-black plus one accent, K4 coloured side-stripe on cards, K3 glassmorphism, K2 one radius plus soft shadow everywhere, I2 emoji as interface icons (admin).
- P2: mostly SD4d meta strings joined with middle dots (13 files), C5 coloured glow shadows, C8 `#d7b45f` vs `#f0d78c` "one hue pretending to be two", SD4m monospace data labels.
- Files with the most P1 findings: `client/src/styles.css` (5), `HomePage.jsx` (2), `AdminPanel.jsx` (2).

**Font files referenced by the 13 `@font-face` rules:**

| Family | File(s) | Size |
|---|---|---|
| Capture It | TTF | 710 KB |
| Nauryz Red Keds | TTF | 572 KB |
| Alistair Signature | TTF | 357 KB |
| Medeo Sans (variable + italic) | WOFF2 ×2 | 331 + 350 KB |
| Playfair Display (+ italic) | TTF ×2 | 345 + 328 KB |
| KTF Jermilov (+ stencil) | TTF/OTF | 110 + 22 KB |
| Medeo Mono | WOFF2 | 92 KB |
| Roslindale Text ×3 | WOFF2 | 92 KB total (declared, unused) |

That is about **3.3 MB** of declared font files. Browsers download only the faces a page uses, so the per-page cost is lower. Even so, the three display TTFs alone (Capture It, Nauryz, Alistair) come to about 1.6 MB, uncompressed.

**Oversized images in `client/public/images`:** `dombra-real.png` 2,214 KB and `kobyz-real.png` 1,732 KB.
