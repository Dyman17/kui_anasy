# QA — dark-redesign-phase-1-2 — 2026-11-05

Environment: built-in browser (desktop app), Vite dev server on 5173, branch `feat/dark-heritage-redesign`, uncommitted work.
API running: **yes** (not "likely not" as assumed). `GET http://localhost:4000/api/pages` returned 200 with 17 pages, so the site rendered CMS pages from the API, not the built-in defaults. Nothing was submitted and no login was attempted (`#admin` login screen only viewed).
Scope: Phases 1-2 of `docs/frontend/DARK_HERITAGE_REDESIGN.md` (dark shell, header, QR popover, account medallion, footer, home hero). Not tested with a screen reader. Page-level `npm run build` not part of this task.

Matrix (header fit / overflow / Kazakh glyphs / names and headings unbroken; lang = kk, ru, en each):
1920 ✔ | 1440 ✔ | 1280 ✔ | 1100 ✔ | 961 ✔ | 768 ✔ | 375 ✔ | 320 ✔

Measured per cell via `javascript_tool`: `scrollWidth > innerWidth` was false in all 24 cells; no header control had `right > innerWidth` or `left < 0`; H1 "Күй анасы" stayed on one line. Header layout by width:
- 1920, 1440: one row, 73 px (75 px in ru, see D4). Nav, search, QR, KZ/RU/EN, medallion all inside the viewport. Right-most control ends at 1604 (1920) and 1364 (1440).
- 1280, 1100, 961: two rows, 121 px (brand + actions on row 1, nav centred on row 2). Matches design §5.1 (single row only at ≥1360).
- 768, 375, 320: brand + search + burger only (44x44 targets). Brand tagline hidden at 320. Burger/search 44 px.
- Kazakh glyphs: canvas width test for ә ғ қ ң ө ұ ү һ і (both cases) against fallback fonts: none missing in Playfair Display or Medeo Sans. Fonts are local (`/fonts/PlayfairDisplay.ttf`, `/fonts/MedeoSans/...woff2`).
- `SPAN.intro-pattern` extends past the viewport at 1280 and below but is clipped (no scrollbar). Not a defect, noted.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Search opens with "/" | pass | `[role=dialog]` "Сайт бойынша іздеу", `aria-modal=true`, focus in input |
| Search opens by click | pass | Іздеу button, focus lands in input |
| Search results navigate | pass | typed "Дина", clicked "Күйшілер аллеясы" -> `#/kk/projects-alley`, title updated, dialog closed, body scroll restored |
| Search Esc | pass | dialog closed, focus back on the Іздеу button |
| QR popover opens | pass | `aria-expanded=true`, `role=dialog`, `aria-controls` set |
| QR image present | pass | data-URL PNG 360x360, alt "Осы беттің QR-коды", dark `#0B1C15` on `#F2EBDD`. Decoding the QR to confirm the encoded URL: **not run** (code builds it from the current page URL) |
| QR download link | pass | `<a download="kui-anasy-kk-qr.png">` with 1024 px data URL; actual file download **not run** (needs permission) |
| QR Esc returns focus | pass | popover closed, `aria-expanded=false`, focus on the QR button |
| Language switch | pass | on `#/kk/projects-alley`: RU -> `#/ru/projects-alley`, EN -> `#/en/projects-alley`, KZ -> back; `html lang` and title follow; slug kept |
| Mobile menu open | pass | 320 px: `role=dialog` "Негізгі мәзір", `aria-modal`, `aria-expanded=true`, focus on close button, body scroll hidden |
| Mobile menu focus trap | pass | 12 Tab presses wrapped to first item, Shift+Tab from first went to last ("Кіру"); focus never left the dialog |
| Mobile menu close | pass | Esc closes, focus returns to burger, body scroll restored |
| Mobile menu links | pass | "Жобалар" -> `#/kk/projects`, menu closed. Language buttons change the route (`#/ru/projects`) but the menu stays open (D5) |
| Account medallion | pass | button "Кіру" -> `#admin`; login screen renders. It is a `<button>`, not a link (no href, no open-in-new-tab) |
| Hero "Күй картасына" | pass | real click scrolled to `#heritage-map` (top 0, header not sticky so nothing covers it), focus moved to `#heritage-map-title`. Smooth scroll, takes about 1-2 s |
| Hero "Дина туралы" | pass | scrolled to `#dina-nurpeisova`, focus moved to its H2 |
| Keyboard order (header + hero) | pass | from a clean load: brand, Тұлғалар, Музыкалық мұра, Жобалар, Кітапхана, Қор туралы, Іздеу, QR, KZ, RU, EN, Кіру, Күй картасына, Дина туралы. DOM order = visual order |
| Focus visible on dark | pass | every one of these gets `outline: solid 1.6px #F0D78C`, offset 2.4 px (about 11:1 on the dark green). No skip link (D3) |
| Heading / landmarks | pass | one H1, `header`, `nav[aria-label]`, `main`, `footer` |
| Reduced motion | partial | `prefers-reduced-motion` emulation not run; no CSS animation active in the hero; script uses `matchMedia` to switch scroll to `auto` |
| Footer | pass | emblem, text, 5 section links to `#/kk/...`, copyright, "Әкімшілік панель" -> `#admin`; cream on `#0B1C15` 14.9:1 |

## Contrast (computed colours, effective background walked up the tree)

| Element | Foreground | Background | Ratio |
|---|---|---|---|
| Hero lead (22 px) | #F2EBDD | #10291F to #24523E gradient | 7.0 (worst) to 13 |
| Hero H1 (63 px) | #D7B45F | #0B1C15 / lower gradient | 8.9 / about 5.5 |
| Hero person line | #F0D78C | #0B1C15 | 12.4 |
| Eyebrow / kicker | #D7B45F | #0B1C15 | 8.9 |
| Nav links | #F2EBDD | #10291F | 13.0 |
| Active language | #F0D78C | #10291F | 10.9 |
| Gold button | #0B1C15 | #D7B45F | 8.9 |
| Dark button | #F2EBDD | #1D4030 | 9.7 |
| Footer text | #F2EBDD | #0B1C15 | 14.9 |

All Phase 1-2 text passes AA. Hero gradient background was read from `.steppe-hero-sky` CSS, not sampled from pixels.

## Console and network
- API 4000 reachable; no failed request seen in the last 100 requests (the tab drops older ones; 497 total, 199 unread). Failures observed: none.
- No external host except `localhost:4000/api/pages`. No Google Fonts or CDN. Fonts: Playfair Display TTF 353 KB, Medeo Sans woff2 339 KB + italic 359 KB (italic loaded on the home page; check it is needed).
- Console error buffer holds 6 entries (`ERR_CONNECTION_REFUSED`, `[vite] Failed to reload /src/styles.css`, two WebSocket failures, two `chrome-error://`). They predate this session (the dev server was restarted while the engineer edited CSS); no new errors appeared during any interaction. `preview_logs` level error: none.
- Image weights on home: hero `dombra-front.webp` 43.8 KB (good). Heavy items loaded eagerly below the hero: `dombra-player-illustration.png` 496 KB, `tolegen-kuanyshev-founder.jpg` 220 KB, `alley-arch-main.jpg` 215 KB, `dina-monument.jpg` 209 KB, `dina-monument-full.jpg` 209 KB (the same file as `dina-monument.jpg`, fetched twice under two names). Total of the home images about 2.6 MB, none of it hero. `dombra-real.png` (2.3 MB) and `kobyz-real.png` (1.8 MB) are in `public/` but not requested on home.

## Regression (known Phase 3/4 leftovers, NOT failures of this phase)
Shell (header, footer, dark body) is correct on every route; no horizontal overflow on any. Low-contrast text found by an automatic scan (ratio < 3 against the effective background), plus visual check:

| Route | Result | Leftovers |
|---|---|---|
| `#/kk` home | ✔ shell/hero | Dina block (`.featured-person-copy`): H2 "Дина Нұрпейісова" #10291F and paragraph #0B1C15 on green card, about 1.3-1.5:1, unreadable. Book strip text (e.g. "күйші есімі (I том)" 1.9), "КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ" 1.1, "Подробнее о клубе" 1.1, library CTA card heading and `.button-dark` 1.3. |
| `#/kk/people-kuyshi` | ✔ shell | H1 "101 Күйші каноны" 1.5, intro paragraph 1.4: dark on dark. |
| `#library` | ✔ shell | intro P 1.4, H2 "Қазақ музыкасының үш том…" 1.3, P 1.5, `.button-dark` "Кітапхананы қарау" 1.3 |
| `#library-vol-1` | ✔ shell | back link "← Цифрлық кітапхана" 1.5 |
| `#projects-alley` | ✔ shell | back link "← Жобалар" 1.5 |
| `#projects-monument` | ✔ shell | back link "← Күйшілер аллеясы" 1.5 |
| `#projects-muragerler` | ✔ shell | "Бағдарламалар" 1.7, back link 1.5 |
| `#about` | ✔ shell | concept P 1.4, library CTA block (H2 1.3, P 1.5, button 1.3) |
| `#about-leadership` | ✔ shell | back link "← Қор туралы" 1.5 |
| CMS standard `#/ru/projects`, `#/en/about` | ✔ shell, `lang` and title correct | same library CTA block (4 items), same as `#about` |
| 404 `#/kk/nonexistent-slug-xyz` | ✔ | "Бет табылмады", 0 low-contrast items, header/footer present |
| ru prefix `#/ru`, `#/ru/projects`, `#/en/about` | ✔ | `html lang` ru/en, title localised |
| `#admin` | ✔ renders | login screen only. H2 "Басқару жүйесі" 1.3 and active tab "Бас әкімші" 1.3 dark on dark; page tint still burgundy-ish at edges (Phase 4) |

Common pattern behind most items: components keep dark-ink text colours (`#0B1C15`/`#10291F`) from the old light theme while the surface is now dark green; `.button-dark` and the "← back" spans are the most repeated. No light (white/cream) panels were left; the scan found no burgundy background in the routes tested (burgundy tint appears only at the `#admin` edges, visually).

## Design fidelity (header and hero vs reference image)
Owner-removed items (sound / Төкпе / Шертпе box, eagle) are correctly absent. Differences:
1. Hero background: reference is a photographic sunset sky with cloud bands, a sun on a horizon and warm olive-gold light. Ours is a flat green vertical gradient with a faint glow. There is no cloud or horizon image.
2. The "sun" is a small soft disc floating mid-hero (about x 47%, y 78% of hero) with no horizon line under it; it reads as a stray dot, and at 375-961 it overlaps the dombra neck.
3. Warmth: reference mid-section is amber/olive; ours stays deep forest green, so contrast and mood are cooler and heavier.
4. Header bar: reference is one row at its screenshot width (about 1420) with a translucent dark band over the sky. Ours is a solid dark bar; single row only at ≥1360, two rows at 961-1359 (by design).
5. Header extras: ours adds a search icon, and the medallion is a user glyph in a ring. Reference medallion is a round gold ornamental seal (no user icon). Reference lang "KZ" underlined in gold; ours matches (underline plus gold).
6. Brand: reference emblem is a filled gold disc with the ornament; ours is a line-art ring/emblem, thinner and less gold.
7. Hero title: reference has a thin, slightly gradient gold with soft shadow; ours is flat solid gold Playfair, a bit heavier. Eyebrow and "Дина Нұрпейісова · 1861–1955" line match in position and style.
8. Left ornament rail: reference is a thin gold filigree strip; ours is a patterned rail about 10 px wide (tiled), visible on every page; denser and busier at small zoom.
9. Dombra: reference tilts and sits lower-right, large with a shadow and a "1861" watermark behind it; ours is similar in size and position, "1861" watermark present but cropped at the bottom edge at 1280 and below.
10. Buttons: reference gold "КҮЙ КАРТАСЫНА" and dark "ДИНА ТУРАЛЫ" match in style; ours are slightly smaller in padding at 1440 (52 px high is as per spec).
11. Hero height: reference hero fills the viewport and ends in the horizon; ours ends at the glow and the next section (Dina card) starts at about one viewport.

## Defects (none P0/P1 in Phase 1-2 scope)
- D1 — P2 — home, 1440 — look at the hero background — expected sunset/sky atmosphere per reference and brief; actual flat green gradient with a floating disc. Needs an image or a drawn horizon (design decision, not an engineering bug).
- D2 — P2 — home 320-961 — view hero — expected the glow disc anchored to a horizon; actual disc overlaps the dombra neck at 375.
- D3 — P3 — all pages — Tab from page top — expected a "skip to content" link (accessibility skill: skip link on pages with long navigation); actual none, the first stop is the brand link and 12 stops precede hero content.
- D4 — P3 — header, kk vs ru — switch language at 1440 — expected equal header height (spec 72 px); actual 73 px in kk/en and 75 px in ru (tagline wraps differently), 2 px jump.
- D5 — P3 — mobile menu — change language inside the menu — expected menu closes (or at least announces the change); actual route and `lang` change while the overlay stays open.
- D6 — P3 — QR popover title — open at 1440 — expected "QR-коды" unbroken; actual title wraps after the hyphen ("Осы беттің QR-" / "коды").
- D7 — P3 — home — load — expected one request per image; actual `dina-monument.jpg` and `dina-monument-full.jpg` are the same file (208,717 B) fetched twice; `dombra-player-illustration.png` 496 KB not optimised.

## Phase 3/4 leftovers (feed for the next phase)
1. Home: Dina featured block (H2 and paragraph dark on dark), book strip, "Подробнее о клубе", media-gallery captions, library CTA card, attribution chips ("КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ").
2. `.button-dark` (1.3:1) used in the library CTA on home, `#about`, `#/ru/projects`, `#/en/about`.
3. "← back" breadcrumb spans on library volume, alley, monument, muragerler, leadership pages (1.5:1).
4. `#/kk/people-kuyshi` H1 and intro.
5. `#library` and `#about` intro paragraphs and library CTA H2/P.
6. `#projects-muragerler` "Бағдарламалар" label.
7. `#admin` login: heading "Басқару жүйесі", active tab "Бас әкімші", burgundy edge tint.
8. Not checked in detail (only the shell): card borders, tables, forms, constructor panels, long Kazakh headings on the dedicated pages at 320.

Viewport reset to desktop at the end of the run.
