# QA — dark-redesign-phase-3-4 — 2026-11-05

Environment: built-in browser (desktop app), Vite on 5173, API on 4000 answering 200 (one `ERR_NETWORK_CHANGED` on /api/pages during the session, bundled-page fallback then logged once; environmental).
Matrix: 320 partial (overflow found) | 375 partial (overflow found) | 768 pass | 1440 pass (overflow). Visual review at 1440 and 375.

## Method limits (read first)
- The screenshot tool returns only a top-left crop of the emulated viewport (800x500 frame), so at 1440 a plain screenshot shows about 55% of the width. For 1440 I applied a temporary `transform: scale(.78)` on `body` through the page (not a code edit) so the full width fits, then scrolled section by section. Layout width stays 1440 (body width measured 1111/.78 = 1425 plus scrollbar). Modals were checked with the transform removed.
- 375 and 320 screenshots were unreliable (crop changes with dpr). At those widths I relied on computed geometry (overflow scan, clipping scan) plus a few full-frame shots. Mobile visual judgement is therefore weaker than desktop.
- Tooltip hover near the right edge could not be done with a real pointer (hover coordinates are limited to the 800x500 frame). Tooltip geometry was computed from CSS instead.

## Overall look vs reference
Header, hero, ornament rail, gold type on deep green all match the reference direction. Inner pages read as the same site: dark green page-hero with image under a green scrim, gold Playfair caps title, gold eyebrow, hairline-divided lists, gold primary buttons. No leftover light or burgundy panels found on any route. Weaker links to the reference: the inner heroes are flat dark with little of the reference's warm sky glow, and several pages are long runs of near-black with gold headings only (people, heritage, about).

## Per-route results (1440 visual / overflow at 1440, 768 / console)
- home (`#/kk`): pass. Hero, featured monument, map, stats, editorial, personalities, gallery, project leaders, Muragerler band, callout, footer all dark and legible. Defects D5, D6, D10.
- people: pass. Book-cover trio is staggered (columns offset by ~40 px), reads as intentional.
- people-kuyshi / zhyrau / anshi: pass. Cards, pills, search, tabs dark. Zhyrau and anshi checked for overflow/contrast only, not screenshotted.
- heritage: D1 (doubled guillemets in quote).
- projects: pass. Last grid row has two cards and an empty third column (P3).
- projects-alley: pass. Boxed bordered cards here versus open hairline lists elsewhere (P3 inconsistency).
- projects-monument: pass at 1440; overflow at 375 and 320 (D3).
- projects-muragerler: pass at 1440 (known content left as is); overflow at 375 and 320 (D3).
- library: pass.
- library-vol-1/2/3: pass at 1440; D7 (eyebrow); vol-2 overflows by 2 px at 320 (D4).
- about: D8 (cover images used as filler).
- about-charter: pass.
- about-leadership: D9 (cropped head in hero).
- 404: D2.
- `#admin`: login screen renders dark (card on dark green, gold CTA, focus ring on key field). Not logged in, nothing submitted. Pass.
- ru and en: home, people-kuyshi, library load, translated h1, no overflow at 1440/768/375/320, no clipped text at 375. Not screenshotted in detail.

## Checks
- Horizontal overflow (scrollWidth vs clientWidth, all 24 routes incl. ru/en): 1440 pass, 768 pass. 375 fail on projects-monument (385) and projects-muragerler (453). 320 fail on projects-alley (373), projects-monument (385), projects-muragerler (453), library-vol-2 (322).
- Contrast (computed fg over effective bg, every text node, kk routes except zhyrau/anshi done separately): no text below 4.5:1 on any route except the transparent 1861 watermark (decorative). Text over photo heroes not measured numerically; visually legible. Work pills: gold rgb(240,215,140) on 15% gold over dark, passes.
- Canon modal: opens (dark green card), Escape closes. Not verified: focus moves into dialog on open (activeElement stayed outside), `aria-labelledby` missing, focus is not returned to the trigger (BODY) (D11).
- Canon search ("Дина" 9 -> 1 results) and tab filter (Батыс -> 4): pass.
- Library reader modal: opens on dark green, Escape closes. Same focus note as canon modal (activeElement not inside dialog).
- HeritageMap: region button click zooms the map, shows the region panel and cards: pass.
- Gallery: next arrow advances slide, dots update, autoplay advancing: pass.
- Hero buttons: "Күй картасына" scrolls to map; "Дина туралы" scrolls to the featured-person section but starts after about 1.5 s (P3 delay).
- Tooltips: right-aligned variant is in place for `.section-topline` and `.intro-copy`. At 1440 and 375 popups fit. At 320 the image-caption popup would start at x=48 with max 300 px, so it ends near 348 and overflows the viewport by about 28 px (computed, not hover-verified) (D12).
- Keyboard: Tab order is DOM order (skip link, logo, 5 nav, search, QR, KZ/RU/EN, account, hero buttons, tooltips, map regions). Focus-visible outline is 1.6 px gold with 2.4 px offset on hero buttons and links, visible on dark. Mobile menu opens, focus lands inside, Escape closes (aria-expanded back to false). Inner page keyboard pass limited to canon modal and menu.
- Console: no application errors. Only Vite HMR WebSocket drops while files hot-updated and one `ERR_NETWORK_CHANGED`. The log notes the API fallback once.
- Network: no external hosts, fonts local (`/fonts/...woff2`, ttf). Every route re-requests the whole image set (all gallery images are loaded eagerly), P3 performance note.

## Defects
- P2 — `#/kk/projects-monument`, `projects-alley` (375, 320), `projects-muragerler` (375, 320) — open page at mobile width — expected no horizontal scroll / actual page scrolls sideways: the `button-dark` prev/next buttons ("Күйшілер аллеясы" / Muragerler) run to 385 px, and the Muragerler form-group/input to 453 px (form is known content, but the width bug is in layout) (D3).
- P2 — `#/kk/zzz-nope`, 1440 — the "404" eyebrow sits at 0 px under the header (main padding-top 0), touching and clipped by the header edge; 404 block is small with the footer right under it (D2).
- P2 — `#/kk/heritage`, 1440 — quote renders `««Белгілі ... тиіс».»`; the source text already contains guillemets and the component wraps them again (D1).
- P2 — `#/kk/about`, 1440 — the "Цифрлық жаңғырту" and "Мұрагерлер" cards use vol-1/2/3 book covers as images and a fourth card repeats the vol-1 cover; images do not relate to the card text (D8).
- P3 — `#/kk/library-vol-1/2/3`, 1440 — hero eyebrow reads "ЦИФРЛЫҚ КІТАПХАНА" jammed against a smaller "I ТОМ" with no separator (D7).
- P3 — `#/kk/about-leadership`, 1440 — a cropped man's head from the hero photo shows at the hero's bottom edge beside the breadcrumb (D9).
- P3 — `#/kk/library-vol-2`, 320 — 2 px overflow from `.volume-meta-details` / `.meta-pairs-grid` (D4).
- P3 — `#/kk`, 1440 — two sections titled "Жобаның басты тұлғалары" (discover list with covers, then project leaders) with the same three people; the first leader row has a 52 px thumbnail while the others have none and a large gap between paragraph and bullets (D5).
- P3 — `#/kk`, 1440 — about 200 px empty gap after the stats band; hero 1861 watermark straddles the hero/ground edge (D6, D10).
- P3 — canon and reader modals — no focus move into dialog, no `aria-labelledby`, focus not returned (D11).
- P3 — `#/kk`, 320 — caption tooltip popup likely overflows the right edge (D12, computed only).
- P3 — projects/alley — card styles differ (boxed vs hairline), last row of projects grid has an empty third column.

Not run: screenshots of every section at 375 (tool crop), real-pointer tooltip hover at the right edge, screen reader, reduced-motion, ru/en visual review beyond overflow/clipping, zhyrau/anshi screenshots.
Viewport reset to desktop: yes.
