# Frontend design guide — «Күй анасы»

This is the visual source of truth for the public site and its content editor. The product is **«Күй анасы»**; **Dala** and **Tolqyn** describe two visual directions, not the product name.

## Audience and voice

- Write for readers who love books or want to discover Kazakhstan's music and culture, regardless of age, profession or country.
- Keep the presentation direct, confident, contemporary and warm. A little wit belongs in editorial copy, not in every label.
- Lead with a clear idea, a strong image and readable text. Remove filler, decorative microcopy and unsupported claims.
- The primary content is currently Kazakh. The homepage adds a short English introduction for international visitors; full Russian and English translations are not implemented yet. Do not present a language control until translated content exists.

## Color

| Token | Value | Role |
| --- | --- | --- |
| Terracotta | `#a14e3a` | Primary action, emphasis and editorial marks |
| Rose paper | `#f2eae9` | Main canvas, header and content panels |
| Dark brown | `#3b1106` | Body text and high-contrast ink |
| Stone | `#cfcac8` | Quiet backgrounds, borders and print surfaces |
| Deep plum | `#33000e` | Music, featured stories and strong closing panels |

Use the five project colors as a system rather than painting every section with every color. Check text contrast whenever the surface changes; do not lower opacity on essential text.

## Typography

| Family | Role |
| --- | --- |
| **Alistair Signature** | Hand-drawn wordmark |
| **KTF Jermilov** | Compact display labels |
| **KTF Jermilov Stencil** | Short uppercase editorial labels |
| **Nauryz Red Keds** | Expressive headline emphasis |
| **Roslindale Text** | Editorial headlines |
| **Playfair Display** | Quotes and image captions |
| **Medeo Sans** | Body text and interface |
| **Medeo Mono** | Code-like editor fields |
| **Capture It** | Occasional stamp-style accent |

Every family used by the frontend is loaded from `client/fonts`; no Google Fonts, external font CDN or package font is used. The Kazakh Cyrillic glyph maps of the supplied font files were checked against `ә ғ қ ң ө ұ ү һ і Ә Ғ Қ Ң Ө Ұ Ү Һ І`; each tested family contains those characters. Font-face declarations and role assignments are in `src/styles.css`.

Preserve Kazakh glyphs (`ә ғ қ ң ө ұ ү һ і`) when changing font files. Use **Medeo Sans** for the homepage `hero-kicker` text so Kazakh uppercase glyphs render reliably; do not use the stencil face for this phrase. Keep body copy at 16 px or larger on desktop and 15 px or larger on mobile. Use small uppercase labels sparingly and never as a substitute for a real heading.

## Layout and spacing

- Centered site plate: 1280 px maximum. Editorial content panels: 1120 px maximum; desktop side margins: 48 px; tablet: 32 px; mobile: 20 px.
- The header, page content, and footer share one continuous `#f2eae9` surface at 80% opacity inside the central shell, rounded 28 px at the outer edge. Individual sections do not create separate light plates; preserve 12 px corners on colored feature blocks for inner contours.
- The admin editor sits inside a rounded, blurred rose-paper plate with a softly contrasted sidebar and editor surface, keeping form controls legible over the photo mosaic.
- Use a 4 px base rhythm. Common gaps: 12, 16, 24, 32, 48, 64 and 88 px.
- Keep headlines large and the reading measure comfortable (roughly 55–75 characters per line).
- A 10-photo mosaic of supplied cultural imagery fills the viewport behind the translucent central shell: five columns by two rows on desktop, two columns by five rows on mobile. Keep plum gradient shading at the edges and vertical ends; use the shell to keep copy readable.
- The home library section is a three-row list of equal photographic cover panels. On wide screens, align each cover image to the right at roughly 70% width and preserve a dark, text-friendly gradient field on the left. On mobile, use the same treatment but widen the cover image to roughly 88% so more of it remains visible.
- Favor uneven editorial compositions elsewhere: one dominant image, staggered story blocks, photographic collection spreads and purposeful color fields. Avoid numbered rows and repeating equal-card grids as the default layout.
- Mobile layouts should stack in reading order, retain readable captions and avoid horizontal scrolling.

## Art direction and patterns

- **Dala**: open compositions, horizon-like curves, stepped movement and warm paper.
- **Tolqyn**: flowing paths and rhythmic linework for music, performance and sound.
- **Print marks**: bold indexes, cropped shapes and publication-like stamps for archive material.
- The original vector patterns live in `public/patterns/`. They are new contemporary graphics, not historical Kazakh ornaments and not claims about traditional symbolism.
- Keep pattern contrast low behind text and stronger in open image fields. Do not use generic graph-paper grids, repeated circles, random ornament packs, faux parchment, decorative noise or ornamental frames around every section.
- `public/images/background-photo-mosaic.jpg` is a 5 × 2 collage and `background-photo-mosaic-mobile.jpg` is a 2 × 5 collage, each showing ten supplied cultural photographs and illustration across a viewport. Both sit beneath plum edge and vertical gradient shading. The 1910 postcard **“Окрестности Оренбурга. Киргизы в праздник около юрты. Почтовая открытка №37”** is one source image; its publisher is unknown. See the [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:%D0%9E%D0%BA%D1%80%D0%B5%D1%81%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%9E%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3%D0%B0._%D0%9A%D0%B8%D1%80%D0%B3%D0%B8%D0%B7%D1%8B_%D0%B2_%D0%BF%D1%80%D0%B0%D0%B7%D0%B4%D0%BD%D0%B8%D0%BA_%D0%BE%D0%BA%D0%BE%D0%BB%D0%BE_%D1%8E%D1%80%D1%82%D1%8B._%D0%9F%D0%BE%D1%87%D1%82%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BA%D0%B0_%E2%84%9637.jpg).
- `public/images/decorative-torsyk.png`, `decorative-asyk.png` and `decorative-qoshqar.png` are original transparent illustrations made for this interface. They are contemporary decorative interpretations, not archival artifacts or authoritative reconstructions.

## Photography and artwork

- Prefer source photographs, archival scans and credited images over generic stock photography.
- Existing alley, monument and book-cover photographs are taken from the project materials supplied in the workspace.
- `public/images/dombra-player-illustration.png` is an illustration embedded in the supplied publication. It is not a verified historical portrait and is labelled accordingly in the interface. Do not attribute it to a named person.
- Before public launch, confirm rights and source credits for all supplied publication images. Use transparent PNG portraits only when their provenance and permission are clear; never invent or imply a historical likeness.
- Add concise, meaningful alt text to informative images. Decorative patterns use `aria-hidden` or CSS backgrounds.

## Page character

- **Home**: expressive Kazakh headline, an English one-line orientation, documentary photography, one large illustrated artwork and clear routes into the collection.
- **People**: biographical/editorial emphasis, recognizable names, confirmed dates and source material.
- **Music**: deep plum and Tolqyn linework; audio and work histories should be added only when verified media is available.
- **Library**: publication covers and print-inspired marks, with calm catalog reading.
- **Projects/about**: terracotta or paper surfaces and a Dala pattern treatment distinct from music and library pages.
- Keep shared navigation, typography and spacing consistent. Vary image, pattern, surface and composition by section.

## Components and references

Public page templates and content blocks live in `src/App.jsx`; visual rules live in `src/styles.css`. The editor has a blank-page constructor with a left module picker and a separate “My pages” manager limited to pages created in the constructor. Available modules: heading, text, feature, quote, image, list, stats, cards, callout and QR link. List items, stat rows and cards are edited with structured form fields rather than raw JSON. QR blocks accept HTTP/HTTPS URLs and render a locally generated QR image. Keep patterns as reusable SVG assets and preserve semantic headings, visible focus states and reduced-motion behavior.

The 21st.dev community catalog was reviewed. Its sign-in component lists an unknown license and requires a platform API key; its featured starter is Next.js, while this project is React/Vite. No third-party component code or new dependency was copied. The editor keeps its existing behavior and uses an original, responsive layout informed by the catalog's form and navigation patterns.

## Validation checklist

- Run `npm run build` from the repository root.
- Inspect the home page and the people, music and library sections at desktop and 375–390 px widths.
- Check that supplied images load, the mobile menu and search work, and `/#admin` can still edit and save content.
- Check contrast, keyboard focus and the browser console. Confirm all fonts load from the local `fonts/` directory and no external font requests are made.
