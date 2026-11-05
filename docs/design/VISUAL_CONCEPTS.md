Status: draft

# Visual concepts: four directions for «Күй анасы» (05.11.2026)

Discovery only. This file prepares options. It does not choose a direction; the owner does. One reasoned recommendation is given at the end and is labelled as such. No code, CSS, font or asset was changed.

Labels on every claim: **Verified** (read in a file or on a web page I opened, with the source named), **Inferred** (reasoned from evidence), **Recommendation** (my proposal, not a fact).

## 0. How to read this file

- Inputs read: `docs/design/FRONTEND_AUDIT.md`, `docs/design/BACKEND_CAPABILITIES.md`, `FINAL.md`, `docs/design/README.md`, the skills `kui-anasy-design` and `visual-direction` (given in the task), the `:root` tokens in `client/src/styles.css`, `client/src/constants/index.js` (nav labels), `client/src/constants/kuishiData.js` (names), and the list of files in `client/public`.
- **I did not re-open the live site.** The audit of the same day already describes it, with screenshots. Every statement about the current UI below is taken from that audit. The browser viewport was not touched.
- I did not render any font. Font statements come from Fontsource language-coverage pages (see section 2). Per-glyph checks (especially Һ/һ) are still to do for every candidate.
- `docs/design/FRONTEND_QUALITY_STANDARD.md` is being written in parallel and did not exist when I listed `docs/design/`. This file points to it by path only.
- Kazakh interface strings that I propose (marked "proposed copy") are placeholders for layout. A Kazakh-speaking editor must approve them. Names, dates and regions quoted from `kuishiData.js` are used only to show layout; the code comment in that file says facts need an archival source, so they stay unconfirmed until the client confirms them.

## 1. Shared ground (applies to all four directions)

### 1.1 Audience and purpose (Inferred from FINAL.md and the audit)

- Arrivals: a QR code at a stele or the monument in Astana (phone, daylight, standing, one hand, maybe a weak signal); search or a shared link (phone first); a school or library visit (laptop); the foundation's staff (editing, not reading).
- Reading stamina varies. Older readers are a core group. FINAL.md asks for body 18 px or larger, line height about 1.6, strong contrast, large tap targets and visible focus.
- Single job per page: learn who this person is, find a person or a place, or reach the book. Primary action at most one per screen.
- Tone, three adjectives that exclude something: **documentary** (not promotional), **calm** (not animated), **ceremonial** (not playful).

### 1.2 What really exists (content inventory, Verified in BACKEND_CAPABILITIES.md and the file list)

| Content | State |
|---|---|
| Photography (real) | Alley arch, alley, gazebo, playground; monument (3 images) and bronze sculpture, dedication plaque; 4 stele photos (küishi side A/B, zhyrau side A/B); founder portrait; 3 book covers plus the «Ұлы дала әуені» cover; one archival 1910 postcard (`steppe-archive-1910.jpg`) |
| Portraits of masters | **None verified.** Current images on canon cards are not portraits (audit P0). Every direction must work with no portrait. |
| Illustration | `dombra-player-illustration.png`, provenance unknown ("атрибуция жоқ"). Not used as a lead image in any concept. |
| People records | 9 küishi, 7 to 9 zhyrau, 5 to 7 anshi in code (the counts differ between documents; unresolved). Titles promise 101 / 110 / 110. Fields: name, dates, region, school, küi titles, short bio. |
| Küi recordings, notation | **None.** No `<audio>`, no storage, no block type. |
| Places | Alley (4 zones, 19 stele names in code), monument, 9 map regions (4 without data) |
| Books | 3 volumes with covers, chapters, ISBN and page counts that are unconfirmed |
| CMS | 17 pages; 10 block types; single column; plain text body; no person URL; article text Kazakh only |
| Patterns | `contour-dombra`, `contour-kobyz`, `contour-torsyk` (light, dark, horizontal variants), `dala-rhythm.svg`, `tolqyn.svg`, `print-marks.svg`, `kazakh-border-*.svg`, `kazakh-rail-gold.svg` (the client-required rail) |

### 1.3 Fixed constraints respected in every concept

- Palette only from `:root`: `--forest-deep #0B1C15`, `--forest #10291F`, `--forest-light #1D4030`, `--gold #D7B45F`, `--gold-light #F0D78C`, `--gold-dark #A9853C`, `--parchment #F2EBDD`, `--paper #E8DFC9`, `--ink #26372D`, `--ink-muted #536458`. No new hue. Concepts differ in proportion and accent discipline.
- Contrast (computed by me with WCAG relative luminance, **Verified** by calculation, same method as the audit): ink on parchment 10.7:1 (audit); ink-muted on parchment 5.3:1 (audit); gold `#D7B45F` on forest `#10291F` 7.8:1 (audit); `--gold-dark` on parchment 2.9:1 (audit, fails); gold on parchment about 1.7:1 (fails); `--gold-dark` on forest about 4.5:1 (borderline). Therefore in every concept: **on parchment, gold-dark is for rules and non-text marks only; text is ink or ink-muted. On forest, text accents are `--gold` or `--gold-light`.**
- **Optional new token, needs owner approval (Recommendation):** `--gold-ink: #7A5F22`, a darker shade of the same gold hue, about 5.1:1 on parchment, for small accent text on light surfaces (kickers, active nav). If refused, accent text on light is ink with a gold-dark underline.
- No gradients for decoration (the contract asks for a background gradient in the dark theme; it uses only forest-deep to forest, see FINAL.md 3.3). No frosted glass, no pill-everything, no icon filler, no numbered 01/02/03 without meaning, no animation on every element.
- The left ornament rail is client-required (FINAL.md 3.5): 64 px on desktop, about 28 px on mobile, never over content. Every concept keeps it; each treats it differently (section 5 of each direction).
- Body 18 px on all screens in every concept (FINAL.md wins over the skill's 16 px minimum). Measure 55 to 75 characters. Names never break inside a word.
- Honest media: no play button, waveform, download or PDF reader is drawn as working. Where audio will live, each concept defines a **media slot** that renders nothing until a media record exists (section 9 of each direction).

### 1.4 Block types today (the reality every concept must fit)

`heading, text, feature, quote, image, list, stats, cards, callout, qr` (BACKEND_CAPABILITIES §5). Verified limits that shape the designs: one column; `body` is one plain paragraph; `heading` renders like `text`; `link` on `text` and `feature` is stored but not rendered; `image` takes a URL or path only; `cards` are not clickable and have no editable image; no per-person URL; hash routes `#/{kk|ru|en}/{slug}`.

Each direction below lists its **minimum renderer changes** (CSS-only, or small component changes) and separates them from **new blocks** (server enum plus renderer plus editor) that would be needed later. The deadline is 16.11.2026 (11 days from today). **Inferred:** only CSS-and-renderer work is realistic before the deadline; new block types and per-person pages are not.

### 1.5 Font verification (Verified, retrieved 05.11.2026)

Source: Fontsource "about" pages, which list language coverage per family. A listing says Kazakh (Cyrillic) is supported; it does not prove each letter is drawn well. **Each family still needs a render test of ә ғ қ ң ө ұ ү һ і in both cases.** For Һ/һ the audit already flags no face has been checked.

| Family | Kazakh (Cyrillic) listed | Licence | Axes and styles | Source |
|---|---|---|---|---|
| Literata (proposed, pending client) | yes | OFL-1.1 | variable: weight 200 to 900, optical size 7 to 72, italic | fontsource.org/fonts/literata/about |
| Alegreya | yes | OFL-1.1 | variable: weight 400 to 900, italic | fontsource.org/fonts/alegreya/about |
| Noto Sans | yes | OFL-1.1 | variable: weight 100 to 900, width 62.5 to 100, italic | fontsource.org/fonts/noto-sans/about |
| Noto Serif | yes | OFL-1.1 | variable: weight 100 to 900, width 62.5 to 100, italic | fontsource.org/fonts/noto-serif/about |
| Source Serif 4 (not used, listed for comparison) | yes | OFL-1.1 | variable: weight 200 to 900, optical size 8 to 60, italic | fontsource.org/fonts/source-serif-4/about |
| Spectral (not used) | yes | OFL-1.1 | static 200 to 800 with italics | fontsource.org/fonts/spectral/about |
| PT Serif (not used) | yes | OFL-1.1 | static 400 and 700 with italics | fontsource.org/fonts/pt-serif/about |

All are self-hostable from `client/fonts/` (OFL allows redistribution). Nothing is added by this file; adding a font is the owner's decision.

## 2. Direction A: «Архив» (Archive catalogue on warm paper)

### A.1 Name and concept
**Archive catalogue.** The site reads as the finding aid of a museum collection: every person, place and book is an entry with a fixed set of facts, and the reader moves by index, not by story.

### A.2 Design philosophy (three principles that settle disputes)
1. **The entry is the unit.** If a thing is a person, a stele, a küi or a volume, it gets the same labelled fact sheet (Name, Dates, Region, School, Source). Layout never varies by whim.
2. **Facts before images; missing is shown as missing.** If a field or portrait has no verified source it is omitted or shows an explicit "дерек жоқ" (proposed copy), never filled.
3. **Type does the decorating.** Rules, small caps, tabular figures and hairlines carry the look. Ornament appears only in the rail and as one contour per screen at low contrast.

### A.3 Visual identity
- **Colour proportion (light-led).** About 70% parchment canvas, 20% paper surfaces (fact sheets, index rows), 8% ink (text, rules), 2% gold-dark (hairlines, the active index letter as a rule, not text). Dark theme "Түнгі дала": forest-deep canvas, forest surfaces, parchment text, gold hairlines.
- **Accent discipline.** Gold is never a fill. It is a 1 px line above every entry heading and the focus ring (2 px `--gold-dark` on parchment; `--gold` on forest).
- **Surfaces.** Flat. No shadows. Entries are separated by 1 px `--line`, not boxes. Radius 2 px everywhere (a catalogue card has corners, not curves).
- **Texture.** None under text. A single `--paper-shade` band behind the fact sheet.
- **Imagery.** Photographs are shown **uncropped at their own ratio** inside a mat (parchment border 12 px), with a credit line under each ("Фото: …", "Мұрағат: …"; proposed copy). The 1910 postcard is shown as an object with its caption, never as a background. Portrait slots without a verified portrait show **no image**: the entry becomes a text entry, not a grey avatar.
- **Instrument contours.** One horizontal contour (`contour-dombra-h`) at about 8% opacity in the page banner, right-aligned, clear of text. Contours never appear inside entries.

### A.4 Typography
- **Family:** Literata (proposed). Verified: Kazakh Cyrillic listed, OFL-1.1, variable with optical size (Fontsource). Kazakh glyph quality unverified until the specimen is checked per letter.
- **Why this family here:** the optical-size axis (7 to 72) lets one family do small caption text (opsz 8) and display names (opsz 60 or more), which is exactly what a catalogue needs from a single face.
- **Scale (px at 375 / 1280):** display 30/48 (names, page titles, wght 600, opsz high, line height 1.1); heading 24/32 (1.2); entry title 20/24 (1.25); body 18/19 (1.6); fact label 14/14 small-caps look by weight 600 and letter-spacing 0.04em (**not** all caps; avoids unchecked uppercase of Kazakh letters); caption 15/15 (1.45); figures use tabular lining numerals for dates.
- **Hierarchy:** one h1 per page; entry names are h2 or h3 in the index; fact labels are `dt`, values `dd` (semantic definition lists).
- **Long words and names.** Each name word is `white-space: nowrap`; a full name wraps only between given name and patronymic («Қазанғап» / «Тілепбергенұлы»). Name size `clamp(1.5rem, 6.4vw, 3rem)`, verified at 320 px against the longest name in the data. `hyphens: manual`, `lang="kk"` on the element, `text-wrap: balance` on headings (**Inferred**: widely supported; check on the oldest target phone).

### A.5 Layout and composition
- **Grid.** 12 columns on desktop, content max 1120 px beside the 64 px rail; reading column 8 columns (about 640 px, 60 to 70 Kazakh characters at 18 px); fact sheet in the remaining 4 columns, sticky on desktop. 4 px base spacing; between major blocks `--spacing-xxl` (64 px) on desktop, 48 px on mobile.
- **Density.** High and even. Lists are dense two-line rows; the whitespace is between entries and sections, not inside rows.
- **Dominant element per screen.** Home: the index of the three canons as a typographic table (not tiles). Canon list: the alphabetical index itself. Person: the name and the fact sheet. Volume: the cover, uncropped, beside the contents. Stele: the name.
- **Mobile (375, ≤480).** One column. Fact sheet moves **above** the text, collapsed to Name, Dates, Region, with a visible "Толығырақ" toggle for the rest. Index letters become a horizontal scrollable strip with 44 px targets. Tablet (768): two columns only for the index (name left, facts right). Desktop (1024 and up): reading column plus sticky fact sheet.

### A.6 Navigation
- **Header.** One row, 64 px tall: wordmark left, six section links as text (no icons), then a "Іздеу" text button, then language and theme. At widths where the six Kazakh labels do not fit (audit P0: header overflow 961 to 1280 px) the nav collapses to a "Мәзір" button; no clipping, no `overflow-x: clip` as a fix. Language switch labels in their own script and full names ("Қазақша", "Русский", "English"), each 44 px high; theme is a text toggle "Жарық / Түнгі дала".
- **Menu.** Full-screen index on mobile: sections with their sub-pages listed underneath as plain links (alley, monument, three canons, three volumes are reachable in one tap, fixing the audit finding).
- **Wayfinding.** A real `nav aria-label="Жол"` breadcrumb above every h1; "Алдыңғы / Келесі" entry links inside canon lists.
- **Language/theme.** Language keeps the current path; untranslated pages show a banner "Бұл бет осы тілде әлі аударылмаған" (proposed copy) above a Kazakh text, since article content is Kazakh only.

### A.7 Component style
| Block | Treatment |
|---|---|
| heading | h2 with a 1 px gold-dark rule above; no kicker unless `eyebrow` is filled |
| text | Single column, 18 px; first line indent none; paragraph spacing 1em (a long body is still one paragraph today: split into several text blocks) |
| feature | Wide entry: eyebrow as fact label, title, text; alternates **not** left/right (replaces the current `index % 2` offset) |
| quote | Set as a catalogue citation: text in italic, attribution on its own line in small weight, hairline left rule; no giant quotation marks, no double «» (audit bug) |
| image | Matted figure, own ratio, caption and credit below; alt required |
| list | Definition-style rows with hairlines |
| stats | Tabular row of figures with labels beneath, in a bordered table; only confirmed figures (audit lists unverified stats) |
| cards | Index rows, not tiles: title, meta, one-line description; whole row is the link where a slug exists (needs the editable `slug`, a renderer and editor change) |
| callout | Paper panel with a gold-dark top rule and one text link |
| qr | QR on parchment with a 16 px quiet zone, URL printed beneath in full, "Көшіру" text button |

- **Person presentation.** Fact sheet (dl): Name; Dates; Region; School; Küis (titles); Source; plus the short bio in the reading column. No portrait unless provided with a credit.
- **Library volume.** Cover uncropped at left (or top on mobile), fact list beside it (Том, Атауы, Жылы; ISBN and page count only once confirmed), contents as a numbered table with real chapter titles. Honest note instead of a reader: the volume is "басылым", the page offers no online reading.
- **Stele card.** One row: stele name, school, region, and a "Беті" link; the card is a 72 px-tall row, not a tile.

### A.8 Interaction and motion
- Hover: underline thickens (1 px to 2 px); focus: 2 px outline, 3 px offset, never removed. Active index letter marked with a bold weight and underline, not colour alone.
- Motion has one job: an expanding fact sheet on mobile (150 ms height change). No smooth-scroll library, no auto-advancing carousel, no scroll reveals.
- **Reduced motion:** the expand is instant; nothing else animates, so there is nothing else to switch off.

### A.9 Music, history, place
- **Music.** Küi titles appear as an indexed list with fields Name, Composer, Region, **Recording** (empty). The slot shows nothing, or a plain dash and "Жазба жоқ", until a media record exists. **Honest: audio is not built.** The design does not draw a player.
- **History.** Chronology is a dated table (year, event, source). Sheet music: a labelled attachment row "Нота" that appears only when a file exists (needs a new block).
- **Place.** The map stays as a single component on the home page (kept from the audit's "preserve" list), restyled flat: parchment land, ink outline, gold-dark markers with text labels beside them (labels vanish at 375 today). Below the map: an index of regions as a table.

### A.10 Key screens in words
- **Home.** Banner: «Күй анасы» wordmark, one-line description, a contour at the right. Then: «Ұлы дала әуенінің тұлғалары» as a three-line index (kuyshi / zhyrau / anshi) with counts only if verified. Then: the Dina Nurpeisova entry as the featured entry (the photograph at its own ratio, fact sheet beside it). Then: the map. Then: the three volumes as a shelf of real covers at equal height, titles below. Footer with contacts.
- **Canon list.** Title, search field (44 px), an A-to-Я strip with the Kazakh alphabet (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І in correct alphabet order; the order must be confirmed by a Kazakh editor), then rows: name (display), dates, region. 23 records fit on three screens at 1280.
- **Person.** Breadcrumb, name, fact sheet and bio. Küi titles list. "Дереккөздер" (sources, proposed copy) section last. QR button in the header of the entry (needs the per-article QR feature, which does not exist; see BACKEND_CAPABILITIES §9).
- **Library volume.** Cover plus fact list, contents table, a text "Қайда алуға болады" only when real.
- **Stele page via QR at 375.** Stele name 30 px; below it the fact lines (dates, region, school); then the bio; then "Аллея картасы" link; the photograph of the stele side at the bottom at its own ratio. No audio slot shown until media exists.

### A.11 References
- **Rijksmuseum, rijksmuseum.nl/en** (Verified: fetched 05.11.2026; image-first home, collection reached by a clear "Collection" link). Take: unhurried image-led object presentation with metadata beside it. Not: promotional ticket banners.
- **The Public Domain Review, publicdomainreview.org** (Verified: fetched). Take: sentence-case short section headings, italic work titles inside headings, compact dates, credit and source lines under images. Not: the shop and membership banners.
- **Smithsonian Folkways, folkways.si.edu** (Verified by search: track listing pages and free liner-note PDFs; the home page returned 403 to me). Take: the album record as liner notes plus track listing. Not: the commerce flow.
- **David Rumsey Map Collection, davidrumsey.com** (Verified: fetched; browse facets What, Where, Who, When). Take: browse by four plain facets. Not: the dense legacy interface.

### A.12 Strengths, weaknesses, risks
- **Strengths.** Best fit to "no invented content" and to missing portraits. Cheapest to keep honest. Strong for search and teaching. Works in light and dark with the same grammar.
- **Weaknesses.** Can read as bureaucratic for a young audience (Muragerler) and does not feel ceremonial on its own. Distinctiveness depends on type and photographs.
- **Risks.** An index is only as good as its data: with 23 records of 321 promised it will look thin, and the counts (101/110/110) in the titles will look wrong next to a short index (**Inferred**). Fact sheets need fields the CMS does not have; before a `person` block exists, a person is only a modal (audit).
- **Effort (React and 8k-line CSS).** Medium. Token layer, type scale and header are quick; rewriting banners, cards and canon list is the work. **Inferred:** about 5 to 7 working days for tokens, header, home, canon list and one text template, before QA.
- **CMS fit.** Good for the 10 blocks; fact sheets for people need a new block or hard-coded data.
- **Accessibility.** Strong: semantic `dl`, real links, no motion. Risk: dense rows must keep 44 px targets.
- **Deadline.** Feasible for a partial migration; full parity not.

### A.13 Suitability score (1 to 5; 5 is best, and for effort 5 means least effort)
Audience 4 · Content fit 5 · CMS fit 4 · Effort 4 · Distinctiveness 3

### A.14 Google Stitch prompts (copy and paste)

**Home page**
```
Design a desktop home page (1280 px wide) and a mobile version (375 px) for «Күй анасы», a digital heritage portal of the «КҮЙ АНАСЫ» foundation in Astana about Kazakh küi (dombra instrumental music), zhyrau epic poets and traditional song. Concept: a museum archive catalogue on warm paper. Calm, documentary, ceremonial. NOT a startup page.
Palette only: parchment #F2EBDD canvas, paper #E8DFC9 surfaces, ink #26372D text, muted ink #536458, antique gold #D7B45F and #A9853C used ONLY as 1 px rules, forest green #10291F for the footer and a 64 px vertical rail on the left edge with a thin gold ornament. No gradients, no shadows, no glass, no rounded pills, radius 2 px.
Font: Literata only (variable, optical size), body 18 px, line height 1.6, names in weight 600. Kazakh Cyrillic letters ә ғ қ ң ө ұ ү һ і must render correctly.
Layout: header with text links «Басты бет», «Тұлғалар», «Музыкалық мұра», «Жобалар», «Цифрлық кітапхана», «Қор туралы», and text buttons «ҚАЗАҚША / РУС / ENG» and «Түнгі дала». Top banner: title «Ұлы дала әуенінің тұлғалары», one line of text, a faint dombra outline on the right. Then a typographic index table of three canons: «Күйші», «Жырау мен жыршы», «Дәстүрлі әнші», each row a link with an arrow-less text. Then a featured entry «Дина Нұрпейісова» with a real photograph at its natural ratio on the left and a fact list (Dates, Region, School) on the right. Then a schematic map of Kazakhstan with text-labelled region markers («Бөкей Ордасы», «Жетісу», «Сарыарқа»). Then three book covers of equal height: «I том · Күй әлемі», «II том · Ғасырлар үні», «III том · Ұлы дала әуені». No stock photos, no icons, no counters, no play buttons.
```

**Inner page: a person entry**
```
Design a person entry page for «Күй анасы», desktop 1280 px and mobile 375 px, archive catalogue style on warm paper. Breadcrumb «Тұлғалар / Күйші каноны / Құрманғазы Сағырбайұлы». H1 «Құрманғазы Сағырбайұлы» in Literata weight 600 (never broken across lines inside a word). Left 8 columns: biography text 18 px, then a list titled «Күйлер» with plain titles. Right 4 columns, sticky: a fact sheet as a definition list with a 1 px gold rule above: «Жылдары — 1818–1896», «Өңір — Батыс Қазақстан, Бөкей ордасы», «Мектеп — Төкпе». No portrait: show text only (portraits are not available). Final section «Дереккөздер». On mobile the fact sheet goes above the text. Colours only: parchment #F2EBDD, paper #E8DFC9, ink #26372D, muted #536458, gold #A9853C as rules, forest #10291F footer. Font Literata only, Kazakh letters ә ғ қ ң ө ұ ү һ і. Radius 2 px, no shadows, no gradients, no icons, no audio player.
```

## 3. Direction B: «Бағдарлама» (Concert programme)

### B.1 Name and concept
**Concert programme.** The site is printed like the programme booklet of an evening of küi: a running order, short notes on every piece and every master, and quiet intervals of white space, so a visitor reads it in sequence from the first line to the last.

### B.2 Design philosophy
1. **Order is the interface.** Content is a sequence: the programme (Roman numerals for volumes and canons, meaningful because they are the real I, II, III of the publications), then notes. A reader always knows "what comes next".
2. **One column, one voice.** The reading column is the same width on every screen and every block; wide things (images, the map) are breaks in the sequence, not parallel columns.
3. **Silence is a component.** Generous space before and after every item, because the subject is music and because older readers need rest between blocks.

### B.3 Visual identity
- **Colour proportion (light-led, ink-heavy).** Light theme: 80% parchment, 10% paper (programme-note panels), 8% ink, 2% gold-dark (rules only). Dark theme: a full forest-deep programme with parchment text and gold rules. **One screen in the light theme is always dark**: the home page ends on a forest band, as a concert ends with the house lights down.
- **Accent discipline.** A single thin gold rule (1 px) above each "item" heading; gold text only on forest.
- **Texture/surface.** Pure flat paper. A faint `print-marks.svg` (crop-mark vocabulary, existing asset) at 6% opacity on the left margin of long pages to say "printed programme"; never under text.
- **Imagery.** Photographs are full-column width, always with a one-line caption set in italic (as a programme's photo credits). The 1910 postcard sits as a "frontispiece" at the top of the Heritage page. No portraits without credit.
- **Contours.** `contour-dombra` appears once per page as a drawn "tuning line": a thin horizontal contour as a section divider between programme items at 10% opacity (not a decoration inside content).

### B.4 Typography
- **Family:** Alegreya (single family). Verified: Kazakh (Cyrillic) listed on Fontsource, OFL-1.1, variable weight 400 to 900 with italic. Glyph quality of Kazakh letters in italic **unverified**. This is a proposal that differs from Literata on purpose: Alegreya's calligraphic rhythm and handsome italics suit titles of küis and programme notes. Alegreya has no optical-size axis, so display and caption sizes rely on weight and spacing (**Inferred** trade-off).
- **Scale (px at 375 / 1280):** programme title 34/56 (weight 700); item title 26/34 (weight 600); note heading 20/22 italic; body 19/20 (weight 400, line height 1.65); small 15/16; Roman numerals set in weight 500 at the item-title size.
- **Hierarchy.** The numeral and title form one line "II · Ғасырлар үні". Küi titles are always in italic with the « » marks kept out of italic.
- **Long words and names.** Names `nowrap` per word; programme titles `text-wrap: balance`; an item title may take two lines but never breaks inside a word. At 320 px, the largest title steps down with `clamp(1.75rem, 8vw, 3.5rem)` (verified at 320 against «Тілепбергенұлы», the longest single word in the data). Dates as thin non-breaking ranges (1818–1896).

### B.5 Layout and composition
- **Grid.** One reading column 640 px (about 58 to 65 Kazakh characters at 19 px) centred in the shell, with the 64 px rail at left. A narrow margin column (180 px) at 1280 only for the item numeral, captions and the "Дерек" (source) note. Outside the column: full-bleed photographs at the page width.
- **Density.** Low. Section gaps 96 px desktop and 72 px mobile; paragraphs 1.2em. Lists and tables are the only dense pieces.
- **Dominant element.** A title line per screen (programme title, then item title). No hero image on the home page.
- **Mobile (375).** Identical column, margin notes fold in under the item as small text. The numeral sits above the title. No collapse needed; this is the strength.
- **Tablet and desktop.** The margin column appears at 1024 and up.

### B.6 Navigation
- **Header.** A programme masthead: the wordmark left, centred below it a thin row of the six section names as plain text with a hairline beneath; on narrow widths one "Мазмұны" (contents) button. No search icon in the header: search is a field on the contents page (the search remains a modal today; this is a Recommendation to simplify).
- **Menu ("Мазмұны").** Opens as a full page that is the programme's contents: each section as an item with its sub-pages listed beneath as numbered lines.
- **Wayfinding.** Each page ends with "Алдыңғы" and "Келесі" (previous and next in the programme order); a real breadcrumb is at the top.
- **Language/theme.** A small text row under the masthead: "ҚАЗ · РУС · ENG" with full names in the contents page; theme "Түнгі дала" as a text switch. Both 44 px tall.

### B.7 Component style
| Block | Treatment |
|---|---|
| heading | A programme "item": numeral (only if set in `eyebrow`) plus title plus hairline |
| text | The core. 19 px, 640 px column. Dropped initial none. A long text split into several `text` blocks reads naturally as paragraphs |
| feature | An item with an eyebrow in italic small, title, text. No left/right staggering (replaces the current offset) |
| quote | "Programme epigraph": centred in the column, italic, 28/36, attribution in small text; no decorative quotation mark graphics |
| image | Full-bleed or column width, with an italic caption and credit |
| list | Programme running order: item, hairline, item (as a list of küi, works, stele names) |
| stats | A single line of figures in running text style; a stats block of more than three numbers becomes a list (`stats` with fewer large numerals; numbering 01/02/03 is dropped) |
| cards | A "next in the programme" list: title, meta, description, row-wide link (needs the editable `slug`) |
| callout | An interval notice: paper panel, no icon, one text link |
| qr | QR beside its URL on a paper panel, with the line "Бетті телефонда ашу" (proposed copy) |

- **Person presentation.** A "programme note" in three parts: name line with dates; a one-sentence "Өңір мен мектеп" (region and school) line; the bio. Küis listed as a running order below. No portrait slot.
- **Library volume.** A programme title page: "III том" numeral, title «Ұлы дала әуені», the cover as a frontispiece, the contents as a running order with chapter titles.
- **Stele card.** One line in a running order: "№ ... Стела name — region". Numbers appear only if sourced (audit: stele numbers unsourced).

### B.8 Interaction and motion
- Hover: underline only. Focus: 2 px outline. Pressed state: ink fill on the contents button.
- Motion: none beyond a 150 ms cross-fade when the contents page opens. The page "turns" via normal navigation; no page-turn effect.
- **Reduced motion:** the cross-fade is removed (instant).

### B.9 Music, history, place
- **Music.** Küi titles form the running order. Each piece has a media slot line: "Тыңдау" appears **only** if a media record exists. **Honest: audio is not built**; today the line is absent. Sheet music: a "Нота" line appears only if a file exists. Both need new block types plus storage (R2 is contract scope but not built).
- **History.** Narrative in the column with a "Дерек" margin note per claim.
- **Place.** The map is an "interval" between items on the home page: full column width, calm, with a text list of regions below it. The alley is described as a "route" with stele pages as its movements.

### B.10 Key screens in words
- **Home.** Masthead. Below it a single line, «Мұраны сақта, жаңғырт, дамыт!» in item-title size. Then "Бағдарлама": the contents of the portal as a numbered programme (I Тұлғалар, II Музыкалық мұра, III Жобалар, IV Цифрлық кітапхана, V Қор туралы) with one sentence each. Then a Dina Nurpeisova item with a full-column photograph and caption. Then the map interval. Then the three volumes as I, II, III. A forest-green closing band holds contacts.
- **Canon list.** Title and a search field, then a running list: name, dates, region; school sub-heads as "Бөлім" (parts) separate the Төкпе and Шертпе traditions. No cards.
- **Person.** The programme note described above; the küi running order; "Дерек" at the end; previous and next master.
- **Library volume.** Frontispiece cover, running order of chapters, a note on how to obtain the book (only once real).
- **Stele page via QR at 375.** The title line is the stele person's name at 34 px; one line of dates and region; the bio in 19 px; the stele photograph full width; "Келесі стела" link at the end. Nothing needs scrolling beyond a short page.

### B.11 References
- **Wigmore Hall, wigmore-hall.org.uk** (Verified by search: concert programmes with notes are published as PDFs at media.wigmore-hall.org.uk; the home page itself returned 403 to me). Take: the programme-note structure, works listed by composer, notes under each item. Not: ticketing UI.
- **Britten–Pears Archive programme catalogue, bpacatalogue.org** (Verified by search: 1940s Boosey & Hawkes programmes with concert notes). Take: the historical programme as a document. Not: the catalogue UI.
- **Aga Khan Music Programme, the.akdn/our-agencies/aga-khan-trust-culture/aga-khan-music-programme** (Verified: fetched; Central Asia is its origin, it plans a searchable archive and tutorials synchronising audio, video and notation). Take: the idea that recording, text and notation belong together on one page, as the long-term plan for the küi pages. Not: any visual look.
- **The Public Domain Review, publicdomainreview.org** (Verified). Take: calm essay rhythm and captions under images.

### B.12 Strengths, weaknesses, risks
- **Strengths.** The best fit to the single-column CMS (it makes the constraint the style). Excellent for older readers and for QR visitors. Lowest content risk. Easily light/dark. Strongest link to the subject (music) without ornament.
- **Weaknesses.** Linear structure is weak for browsing 300 people or for finding by place. The home page has no striking image, which may feel quiet to the client; mitigated by one strong photograph in the Dina item.
- **Risks.** Alegreya has fewer weights and no optical size, so small captions need testing; another family than Literata means the client's pending approval of Literata is bypassed (the owner must accept this). A running-order list of 101 names needs filters, not an endless scroll.
- **Effort.** Low to medium. The column and type are simple; the legacy banners and cards need replacement. **Inferred:** 4 to 6 working days for tokens, header, home, one text template and canon list.
- **CMS fit.** Excellent. No new blocks required for the base; Roman numerals via `eyebrow`.
- **Accessibility.** Strong: one column, real headings, large type, no motion. Check Alegreya italic at 15 px.
- **Deadline.** Most feasible of the four.

### B.13 Suitability score
Audience 5 · Content fit 4 · CMS fit 5 · Effort 4 · Distinctiveness 4

### B.14 Google Stitch prompts

**Home page**
```
Design a desktop home page (1280 px) and mobile (375 px) for «Күй анасы», the digital portal of the «КҮЙ АНАСЫ» foundation about Kazakh küi, zhyrau and traditional song. Concept: a printed concert programme: a single reading column, running order, quiet spacing. Not a SaaS landing page.
Palette only: parchment #F2EBDD background, paper #E8DFC9 panels, ink #26372D text, muted #536458, gold #A9853C as 1 px rules, antique gold #D7B45F only on dark, forest #10291F and #0B1C15 for the closing band and a 64 px left rail with a thin gold ornament. No gradients, no shadows, no glass, no pills.
Font: Alegreya only, body 19 px / line height 1.65, titles weight 600-700, italic for piece titles. Kazakh letters ә ғ қ ң ө ұ ү һ і must be correct.
Content in a single 640 px centred column: masthead «Күй анасы» with the six sections as a quiet row («Басты бет», «Тұлғалар», «Музыкалық мұра», «Жобалар», «Цифрлық кітапхана», «Қор туралы»); line «Мұраны сақта, жаңғырт, дамыт!»; a «Бағдарлама» running order with Roman numerals I to V, one sentence each; a full-width photograph of the Dina Nurpeisova monument with an italic caption; a quiet map interval of Kazakhstan with text-labelled regions; three volumes numbered I, II, III («Күй әлемі», «Ғасырлар үні», «Ұлы дала әуені») with cover images; a closing dark green band with contact lines. No icons, no counters, no stock images, no audio player.
```

**Inner page: library volume**
```
Design a library volume page for «Күй анасы», desktop 1280 px and mobile 375 px, concert-programme style. Title block: numeral «III том» and title «Ұлы дала әуені» in Alegreya 700; the book cover image (portrait ratio, shown uncropped) as a frontispiece; below it a running order of chapters (hairline between lines, chapter title left, page range right); a short italic note. One 640 px column, parchment #F2EBDD, ink #26372D, muted #536458, gold #A9853C rules, paper #E8DFC9 for a note panel, forest #10291F footer and a 64 px left rail. Previous and next links «Алдыңғы том» and «Келесі том». No online reader, no download button, no ISBN, no icons, no gradients, no shadows. Font Alegreya only, body 19 px, Kazakh letters ә ғ қ ң ө ұ ү һ і.
```

## 4. Direction C: «Дала атласы» (Steppe atlas)

### C.1 Name and concept
**Steppe atlas.** The site is a map before it is a list: every person, school, stele and book has a place, and the reader travels across the steppe from Бөкей Ордасы to Жетісу.

### C.2 Design philosophy
1. **Where first.** Every entry shows its place (region and school) before anything else; moving by place is the primary navigation, moving by name the secondary one.
2. **Honest gaps are part of the map.** Regions without data stay on the map as quiet, labelled empty areas ("Дерек жиналуда", proposed copy; the existing component already says "being compiled"). The map never pretends to completeness.
3. **Labels are the interface.** Text labels at readable sizes, never icons alone; the map is also always available as a list.

### C.3 Visual identity
- **Colour proportion (dark-led map, light reading).** The map area and home page are forest (60% forest-deep and forest, 25% forest-light for regions, 10% gold lines and labels, 5% parchment text). Reading pages (a person or a volume) switch to parchment, 75% parchment, 15% paper, 10% ink with gold-dark rules. The reader goes from dark map to light page, as from table to text.
- **Accent discipline.** Gold is cartographic: borders of regions at 1 px, active marker as a gold ring, labels in `--gold-light` on forest. Never a button fill.
- **Surfaces.** Flat and drawn: hairline outlines, graticule lines in `--line`. No fills with gradients.
- **Imagery.** Photographs are inserted as "plates" with a number-free caption and a location line: "Орын: Астана, Күйшілер аллеясы". The 1910 postcard is shown as a historical plate beside the Бөкей Ордасы region.
- **Contours.** The instrument contours are used as map **symbols** at 24 px (dombra for küi schools, kobyz for kobyz tradition, torsyk as a decorative corner). This follows the skill ("contemporary graphics, not claims about traditional symbolism"). **Open question:** whether the client agrees that contours act as map symbols.

### C.4 Typography
- **Family:** Noto Sans (single family). Verified: Kazakh (Cyrillic) listed on Fontsource, OFL-1.1, variable weight 100 to 900 and width 62.5 to 100 with italic. Kazakh letters in Noto have a long track record on phones (**Inferred**, from the project's purpose: Noto aims to remove missing glyphs). Per-glyph check unverified.
- **Why a sans here:** map labels need compact, regular letterforms; the width axis (down to 62.5) gives condensed labels for tight spots without a second family. Trade-off: less warmth than a serif; the client's pending Literata is bypassed.
- **Scale (px at 375 / 1280):** map title 28/44 (weight 600); region name 22/28 (weight 600, width 100); label 16/16 (weight 500, never below 16 so older readers can read a map label, unlike today's tiny ones); body 18/18 (line height 1.6); small 15/15; coordinates and dates tabular.
- **Long words and names.** `nowrap` per word; on a map, a label that does not fit moves to a leader line instead of shrinking; width axis 85 used for names beside markers only. Person names in lists at `clamp(1.375rem, 6vw, 2.5rem)`.

### C.5 Layout and composition
- **Grid.** Home: the map is the page: a full-width figure (up to 1280 px) at 3:2 desktop and 1:1 mobile, with a 360 px side panel on desktop. Reading pages: a 640 px column plus a 280 px "Орны" sidebar with a small locator map.
- **Density.** Home is open, the side panel dense. The reading pages are quiet.
- **Dominant element.** The map on home; the locator and name on a person page; the region on an index.
- **Mobile (375).** The map is 100% width, 1:1, with the region list **below** it as the real control (as in the current component). The side panel becomes a bottom sheet that opens over the list. Locator maps on reading pages are 120 px tall, below the title.
- **Tablet (768).** Map above, panel below (no overlay). Desktop: panel at right.

### C.6 Navigation
- **Header.** A slim top bar with the wordmark, six sections as text, a "Карта" quick link always visible, then language and theme. Same collapse rule as A (menu button when Kazakh labels do not fit).
- **Menu.** Sections plus a second list "Өңірлер" (regions) as direct links (a region page does not exist today; it needs a route or a filtered canon view: **new**, see C.12).
- **Wayfinding.** The locator map on a page doubles as breadcrumb: the region highlighted; "Картада көрсету" (proposed copy) links back.
- **Language/theme.** Language and theme remain in the header; the map's labels switch with the language. The existing component already has kk, ru and en labels (Verified in BACKEND_CAPABILITIES §8).

### C.7 Component style
| Block | Treatment |
|---|---|
| heading | h2 with a region-style thin rule; eyebrow shows a place when set |
| text | 18 px column; short paragraphs |
| feature | Text with a "plate" photo and location line |
| quote | Placed in the margin as a region-tagged quotation; italic; attribution with place |
| image | Plate with caption and `Орын` line |
| list | Gazetteer rows: name, place, years |
| stats | Only confirmed numbers; rendered as map legend items (value plus label) |
| cards | Region cards with a place first line; row link (needs slug) |
| callout | Panel with a gold-dark border; a "Картада көру" link possible |
| qr | QR with "Бұл орынға сілтеме" (proposed copy); the URL below |

- **Person presentation.** Place, then name: a locator, region and school, then the name and dates, then the bio and küi list. Without verified portraits, no image.
- **Library volume.** Cover plus "Қамтылған өңірлер" (regions covered) only if the editors can supply a mapping (data absent: **new**).
- **Stele card.** Stele name plus a position on a small alley plan (the alley has 4 zones in code; a site plan graphic does not exist: **new asset** needed from the client).

### C.8 Interaction and motion
- The only animated element is the map: the slow smooth zoom already required by the contract (FINAL.md §2.2.4), 700 to 900 ms ease-out, ending with focus moved to the side panel title. A "Картаны толық көру" button returns to the full view (contract wording).
- Markers: keyboard buttons with `aria-pressed` (kept from the existing component), 44 px hit areas even if the visible mark is 16 px.
- **Reduced motion:** zoom becomes an instant jump (the component already has a reduced-motion branch).

### C.9 Music, history, place
- **Music.** A school (Төкпе, Шертпе and so on) is a place, so the music is explained by its regions. **Honest: audio is not built**; a marker panel shows küi titles only. A recording slot is absent until media exists. No play control.
- **History.** A time slider is not offered (invented data risk); the 1910 postcard and the archive plate give historical depth.
- **Place.** The core. Four regions have no data (Сарайшық, Маңғыстау, Ұлытау, Тарбағатай; Verified in FINAL.md); the map shows them with the honest empty message.

### C.10 Key screens in words
- **Home.** A dark full-width map with nine labelled regions; right panel with «Картаны толық көру»; below: title «Ұлы дала әуенінің тұлғалары» and three entry links; then Dina Nurpeisova as a plate with its location (Астана, monument) and her region (Батыс Қазақстан, Нарын құмы, from code); then volumes.
- **Canon list.** A split view: the map left (region filter), the list right; on mobile the list first, then "Картада көрсету".
- **Person.** Locator map; name; region and school; bio; küi list; "Басқа осы өңірдің тұлғалары" (proposed copy), same region links.
- **Library volume.** Standard reading page; cover; contents.
- **Stele page via QR at 375.** Name at 30 px; place lines (Астана, Күйшілер аллеясы, zone); the photograph; a 160 px-tall alley locator below it (needs a plan asset); the bio.

### C.11 References
- **Radio Garden, radio.garden** (Verified: fetched; a rotating globe through which you choose a place and listen). Take: the idea that place is the way in. Not: a globe or any audio feature before audio exists.
- **David Rumsey Map Collection, davidrumsey.com** (Verified: fetched; What, Where, Who, When facets, text on maps search, georeferenced overlays). Take: plain facets and honest map metadata. Not: dense legacy UI.
- **Commonwealth War Graves Commission, cwgc.org** (Verified: fetched; "Find Cemeteries & Memorials" with a near-me option; formal tone). Take: finding a place near you as a first-class action (a "near me" idea for the alley). Not: its commerce banners.

### C.12 Strengths, weaknesses, risks
- **Strengths.** Highest distinctiveness. It builds on the best existing component (the map), required by the contract. Makes the missing regions a visible, honest task for the client.
- **Weaknesses.** The map is a mobile problem at 375 (small targets, vanished labels today) and an older-reader problem; the list must always be the primary control. Dark-led home conflicts with the light default theme the contract names (FINAL.md §3.2: light is the default).
- **Risks.** Content: only 5 of 9 regions have data and 23 of 321 people exist, so the atlas looks sparse (**Inferred**). CMS: a region is not a data type; person pages and region routes need new data and routes (BACKEND_CAPABILITIES §10.2). It would hard-code more in the frontend, against contract §1.3 (staff fill all content).
- **Effort.** High. **Inferred:** 12 or more working days for the map redesign, regions and routes; not completable by 16.11.2026 beyond restyling the existing map.
- **CMS fit.** Weak; needs a person and region model.
- **Accessibility.** Medium to risky: map interaction must have a complete list alternative; labels at 16 px minimum.
- **Deadline.** Not feasible in full. A restyled map component alone is feasible.

### C.13 Suitability score
Audience 3 · Content fit 3 · CMS fit 2 · Effort 2 · Distinctiveness 5

### C.14 Google Stitch prompts

**Home page**
```
Design a desktop home page (1280 px) and mobile (375 px) for «Күй анасы», a heritage portal of the «КҮЙ АНАСЫ» foundation about Kazakh küi, zhyrau and song. Concept: a steppe atlas: the map is the main element, an honest cartographic style (hairlines, labels), not a game or a SaaS dashboard.
Palette only: forest #0B1C15 and #10291F background, forest light #1D4030 for regions, antique gold #D7B45F for 1 px region borders, light gold #F0D78C for labels, parchment #F2EBDD for text and for the lower reading section, ink #26372D on parchment, 64 px left rail with a thin gold ornament. No gradients, no glass, no neon, no shadows.
Font: Noto Sans only (width 85-100), labels 16 px minimum, body 18 px. Kazakh letters ә ғ қ ң ө ұ ү һ і must be correct.
Layout: slim header with text links «Тұлғалар», «Музыкалық мұра», «Жобалар», «Цифрлық кітапхана», «Қор туралы», language «ҚАЗ / РУС / ENG». Full-width schematic map of Kazakhstan with nine labelled regions: «Бөкей Ордасы», «Сарайшық», «Маңғыстау», «Шалқар», «Қаратау», «Ұлытау», «Сарыарқа», «Тарбағатай», «Жетісу»; regions with no data are drawn as outline only. Right panel with a region card and a text button «Картаны толық көру». Below the map on parchment: title «Ұлы дала әуенінің тұлғалары» with three links, then a real photograph of the Dina Nurpeisova monument labelled with its place. No icons, no stock photos, no people portraits, no audio player.
```

**Inner page: a place and a person**
```
Design a person page for «Күй анасы» in steppe atlas style, desktop 1280 px and mobile 375 px. Parchment #F2EBDD canvas, ink #26372D text, muted #536458, gold #A9853C rules, forest #10291F footer with 64 px left rail. A 280 px sidebar «Орны» with a small outline map of Kazakhstan highlighting «Бөкей Ордасы» and the text «Батыс Қазақстан, Бөкей ордасы». Main column 640 px: H1 «Дәулеткерей Шығайұлы», dates «1820–1887», a short biography at 18 px, then a plain list of küi titles. At the end a text link «Осы өңірдің басқа тұлғалары». No portrait (none available), no audio player, no icons. Font Noto Sans only, Kazakh letters ә ғ қ ң ө ұ ү һ і.
```

## 5. Direction D: «Стела» (Quiet monumental, memorial)

### D.1 Name and concept
**Stele.** Each page is a carved inscription: a deep green field, a name in large gold-edged type, and very few things around it, designed first for a person standing at the stele with a phone.

### D.2 Design philosophy
1. **The name is the monument.** Every page starts with a name or a title at monumental scale; nothing competes with it above the fold.
2. **Phone, daylight, one thumb.** The design is checked first at 375 px in sunlight: high contrast, 20 px reading text, 56 px targets, no hover dependency, no scrolling to reach the first fact.
3. **Dignity over delight.** No motion that is not a state change, no promotional modules, no counters; the tone is a memorial's, not a campaign's.

### D.3 Visual identity
- **Colour proportion (dark-led).** The default look is forest: 55% forest-deep and forest, 15% forest-light (raised surfaces), 15% parchment (text), 10% gold (name edge, rule, focus), 5% paper (long-read panels). The light theme exists (the contract requires both) but turns the monument inside out: parchment 75%, forest only for the header, name band and footer. **Open question:** which theme is the default; the contract names light as default (FINAL.md §3.2), but this direction is designed dark-first, so the owner must decide.
- **Accent discipline.** Gold appears once per screen at large scale (the rule beneath the name) plus the focus ring. Never as text under 24 px on light.
- **Surfaces and texture.** Flat forest fields; one 1 px gold rule; no shadow. The only texture is the forest-deep to forest background gradient requested by the contract (FINAL.md §3.3), of two stops, used subtly; the exact stops are still the client's open question.
- **Imagery.** Photographs are large and dim-framed: full-width, uncropped on mobile, cropped to 21:9 on desktop only for the alley and monument photographs; stele photographs are never cropped. Without portraits, the **stele photograph itself** is the picture for that person only if the client confirms it as a record of that stele (not as a portrait).
- **Contours.** One large contour (kobyz or dombra) at 6 to 8% opacity as the field behind the name, offset to the right, never behind body text.

### D.4 Typography
- **Family:** Noto Serif (single family). Verified: Kazakh (Cyrillic) listed on Fontsource, OFL-1.1, variable weight 100 to 900 and width 62.5 to 100 with italic. Per-glyph check unverified. Reasoning: a sturdy inscriptional serif with a width axis suits monumental names; the width axis allows 75 to 85 width for long names at big sizes so «Тілепбергенұлы» fits at 320 px without a smaller size (**Inferred**, needs testing).
- **Scale (px at 375 / 1280):** monument name 36/72 (weight 700, width 90, line height 1.05, one word per line allowed); page title 30/48; subtitle 22/28 (weight 400 italic for dates and region); body 20/20 (line height 1.6, weight 400; heavier than the other concepts because the primary reader is outdoors); caption 16/16; button label 18/18 (weight 600).
- **Long words and names.** `nowrap` per word; the name is allowed to stack one word per line (given name, patronymic); size by `clamp(2rem, 11vw, 4.5rem)` on mobile and a fixed 72 px from 1024; width axis steps from 100 to 80 below 360 px. The name is never auto-hyphenated.

### D.5 Layout and composition
- **Grid.** A single centred "stele column" of 560 px at all desktop widths, with the rail at left; large photographs break out to 1120 px. Reading text max 62 characters.
- **Density.** Very low and highly assigned: 128 px above and below the name block on desktop, 72 px on mobile; between blocks 80/56 px.
- **Dominant element.** The name block: forest field, name, one gold rule, dates and region beneath.
- **Mobile (375).** Order is fixed for a QR page: name block, a 56 px "Тыңдау" slot only if audio exists (otherwise nothing), the first 3 sentences of the bio, the stele photograph, the rest of the bio, then the link to the alley. No sticky bar except a 56 px footer bar with "Аллея картасы" and "Басты бет"? (**Open question:** a sticky footer bar is a pattern with a cost on small phones; default is none.)
- **Tablet and desktop.** The same single column; the photograph breaks out wider; no sidebars.

### D.6 Navigation
- **Header.** Minimal: wordmark left; at the right one 48 px "Мәзір" button; language and theme live inside the menu and also as a compact "ҚАЗ" toggle that is visible on every page (a visitor from a QR might not read Kazakh).
- **Menu.** A full-screen forest field; sections as 28 px text lines; sub-pages under each as 20 px lines. Closes with Esc and a visible "Жабу" button; focus is trapped inside and returned on close (the audit notes current dialogs lack this).
- **Wayfinding.** On a stele page: the "Аллея" breadcrumb; at the bottom "Аллея картасы" and previous/next stele as two large text blocks.
- **Language/theme.** Language shown by its own script in the menu (Қазақша, Русский, English); theme as "Жарық / Түнгі дала" text toggle with a 56 px target.

### D.7 Component style
| Block | Treatment |
|---|---|
| heading | A new "name block" variant when the page title is a person; otherwise a large 30 px title with a gold rule |
| text | 20 px, 560 px, paragraph gap 1.2em, parchment on forest |
| feature | A field panel (forest-light) with eyebrow, title and text; full width of the column |
| quote | Inscription: centred, 28/36, one gold rule above, attribution beneath; no marks |
| image | Large, with a caption under it in 16 px; credit required |
| list | Inscription list: name per line, hairline between |
| stats | A short row of 2 to 3 confirmed numbers, large (48/72) with small labels; none unless confirmed |
| cards | Large stacked panels (title, meta, description, full-width link); never in a grid |
| callout | A framed panel, 1 px gold border, no fill change |
| qr | The hero of the monument page: a large QR (min 200 px on mobile) on a parchment square with the URL printed below in 18 px |

- **Person presentation.** Name block; one line of dates; one line of region and school; a short bio; the küi titles as an inscription list; sources at the end.
- **Library volume.** Cover large at the top (portrait, uncropped), title in 30 px, 3 facts, contents. No reader.
- **Stele card.** On the alley page: a full-width panel per stele with the stele name at 28 px, the school, the "Беті" link as a 56 px full-width text button; no tile grid.

### D.8 Interaction and motion
- Hover and press: background to forest-light, no scale effects. Focus: 3 px gold outline on forest, 3 px ink on parchment.
- Motion: only the menu open/close (200 ms opacity) and a photograph fade-in (200 ms), both state changes. No parallax, no autoplay.
- **Reduced motion:** both become instant.
- **States specific to QR use:** offline or slow connection shows the name block first (text loads before images; the photograph has a fixed ratio box so nothing jumps).

### D.9 Music, history, place
- **Music.** The page carries one reserved, labelled position for a listening control (a media slot under the name block). **Honest: audio is not built**; the slot renders nothing today. When R2 audio exists, the slot becomes a single large "Тыңдау" button with a title and a duration; one player, one track.
- **History.** Short, sourced, in large type; the 1910 postcard as one full-width exhibit.
- **Place.** The alley is the site's centre of gravity: a stele list, a plan (needs an asset), and visiting information at the **top** of the alley page, not the bottom (fixes audit P2 #17): address and hours only once confirmed by the client (they are unsourced today).

### D.10 Key screens in words
- **Home.** A forest full-screen opening: «Күй анасы» wordmark and one line, a monument photograph below it (the Dina Nurpeisova monument at full width), then a quiet column: «Ұлы дала әуенінің тұлғалары» with three large links (Күйші, Жырау, Әнші), the map as one section with a list under it, the alley, the volumes as three large cover stacks.
- **Canon list.** One name per row at 24 px with dates; school as a section title; filters as three large tabs.
- **Person.** Name block; dates and region; bio in 20 px; küi inscription list; sources.
- **Library volume.** Large cover; facts; contents.
- **Stele page via QR at 375.** Forest field. Name at 36 px stacked (e.g. «Дәулеткерей» / «Шығайұлы»); one rule; «1820–1887» and «Бөкей ордасы» in italic 22 px; the first 3 sentences of the bio at 20 px; a full-width photograph of the stele side; the rest of the bio; two large text blocks "Алдыңғы стела" and "Келесі стела"; a quiet footer with the language toggle. No audio slot until audio exists.

### D.11 References
- **Commonwealth War Graves Commission, cwgc.org** (Verified: fetched; a formal and reverent register, "Find Cemeteries & Memorials" with a near-me option). Take: dignified tone and the place-first, visit-first structure. Not: promotional banners.
- **National Memorial for Peace and Justice and Legacy Museum, Montgomery** (Verified by search: Dezeen, 2018, and MASS Design Group, designer; the official site museumandmemorial.eji.org returned 403 to me, so I did not review it). Take: the principle that names carried at scale and plain material do the work. Not: any iconography or its subject-specific imagery.
- **Rijksmuseum, rijksmuseum.nl/en** (Verified: fetched). Take: image-first, calm presentation with few modules.
- **Aga Khan Music Programme** (Verified). Take: only the long-term idea of one recording per page placed with its text.

### D.12 Strengths, weaknesses, risks
- **Strengths.** Best for the QR and monument audience and for older readers (largest type, biggest targets, shortest page). A single column fits the CMS. Strong emotional fit for the Dina monument and the alley.
- **Weaknesses.** Dark-led long reading is harder and the client approved parchment as the default; the monumental type is repetitive across 300 pages, and the home page can feel heavy. Large type means long pages for long bios.
- **Risks.** Gold-on-forest only; any lapse to gold on parchment fails (2.9:1 or worse). Stacked names depend on the width axis and a per-glyph check of Noto Serif; the QR page needs real data per stele, and per-stele URLs do not exist today (a stele page is a modal or a hard-coded section: BACKEND_CAPABILITIES §10.2), so the main use case is **not buildable without a new addressable page type** (each stele or person needs a slug; the CMS already supports pages with slugs, so one CMS page per stele is possible with the present blocks, at a cost of editorial work; **Inferred**).
- **Effort.** Medium. **Inferred:** 6 to 8 working days for tokens, the name-block variant, the menu dialog, the stele template, home and the alley page.
- **CMS fit.** Good: the stele page can be a normal CMS page: `heading` (name), `text`, `image`, `qr`. The name-block variant needs a small renderer change, no server change. Person pages for all 300 people are still not possible.
- **Accessibility.** Strongest of the four for the QR user; the focus-trapped menu fixes an audit gap. Risk: dark theme default needs a visible light option.
- **Deadline.** Feasible for the stele template, the menu, the home page and tokens; the rest follows.

### D.13 Suitability score
Audience 5 · Content fit 3 · CMS fit 3 · Effort 3 · Distinctiveness 4

### D.14 Google Stitch prompts

**Home page**
```
Design a mobile (375 px) home page and a desktop version (1280 px) for «Күй анасы», the heritage portal of the «КҮЙ АНАСЫ» foundation in Astana about Kazakh küi, zhyrau and traditional song. Concept: a quiet monumental memorial, inscription-like: very large names, deep green fields, very few elements, phone-first for visitors at a monument.
Palette only: forest #0B1C15 and #10291F fields, forest light #1D4030 raised panels, antique gold #D7B45F for one 1 px rule and focus rings, parchment #F2EBDD text (and a light theme with parchment canvas and ink #26372D), a 64 px (28 px on mobile) left rail with a thin gold ornament. A subtle two-stop dark gradient from #0B1C15 to #10291F is allowed; no other gradients, no glass, no shadows, no pills.
Font: Noto Serif only, width 85-100, body 20 px, names 36 px (mobile) to 72 px (desktop), weight 700. Kazakh letters ә ғ қ ң ө ұ ү һ і must be correct.
Layout: a minimal header with the wordmark and a 48 px «Мәзір» button plus «ҚАЗ». Opening: «Күй анасы» and one line «Мұраны сақта, жаңғырт, дамыт!», then a full-width photograph of the Dina Nurpeisova monument. Then one column (560 px): «Ұлы дала әуенінің тұлғалары» with three large links «Күйші», «Жырау мен жыршы», «Дәстүрлі әнші»; a section «Күйшілер аллеясы» with a photograph of the alley arch and a link; three book covers: «Күй әлемі», «Ғасырлар үні», «Ұлы дала әуені». Tap targets at least 56 px. No icons, no stock photos, no counters, no audio player.
```

**Inner page: stele page opened from a QR code (375 px)**
```
Design a mobile (375 px) stele page for «Күй анасы», opened by scanning a QR code at the Күйшілер аллеясы in Astana. Forest field #0B1C15 to #10291F. Top: «Күй анасы» wordmark small, a 48 px «Мәзір» button and «ҚАЗ». Then the name block: «Дәулеткерей» and «Шығайұлы» stacked, Noto Serif 700, 36 px, parchment #F2EBDD, one 1 px gold #D7B45F rule beneath; below it in italic 22 px «1820–1887» and «Бөкей ордасы». Then a biography excerpt in 20 px, line height 1.6; a full-width photograph of the stele side; the remaining text; two large full-width text blocks «Алдыңғы стела» and «Келесі стела» (min height 56 px); a quiet footer with the language toggle «ҚАЗАҚША / РУС / ENG» and the left rail 28 px with a thin gold ornament. No audio player, no icons, no gradients except the two-stop green, no shadows, no pills. Kazakh letters ә ғ қ ң ө ұ ү һ і.
```

## 6. Comparison table

(Scores 1 to 5, 5 best; for effort 5 means least effort. All scores are **Inferred** from the evidence in this file.)

| Axis | A «Архив» | B «Бағдарлама» | C «Дала атласы» | D «Стела» |
|---|---|---|---|---|
| Core metaphor | Museum finding aid | Concert programme booklet | Atlas, place first | Memorial inscription |
| Theme lead | Light (70% parchment) | Light, with a dark closing band | Dark map, light reading pages | Dark-led, light option |
| Composition | 12-col, reading column plus sticky fact sheet | One 640 px column, margin notes | Map plus side panel; locator on pages | One 560 px stele column, giant name |
| Navigation | Text header, A-to-Я index, full index menu | Masthead and "Мазмұны" contents, previous/next | Map is the nav, region list | Minimal header, full-screen menu, previous/next stele |
| Typography | Literata, optical size, small label style | Alegreya, italic piece titles | Noto Sans, width axis, 16 px labels | Noto Serif, width axis, 36 to 72 px names |
| Density | High, even | Low, sequential | Open map, dense panel | Very low |
| Components | Index rows, matted figures, fact sheets | Running orders, epigraphs | Gazetteer rows, plates, legend | Stacked panels, inscription lists, large QR |
| Interaction | Almost none; fact sheet expand | Almost none; contents page | Map zoom (contract), panel | Menu and image fade only |
| Music handling | Indexed list with empty recording field | Running order with absent "Тыңдау" | Schools as regions; titles only | One reserved media slot |
| Best for | Search, research, teachers | Reading in order, older readers, CMS | The map story, client demo | QR at monuments, phones |
| Weakest at | Ceremony, youth | Browsing 300 people, place | CMS, sparse data, 375 px maps | Long bios, light default |
| Audience | 4 | 5 | 3 | 5 |
| Content fit | 5 | 4 | 3 | 3 |
| CMS fit | 4 | 5 | 2 | 3 |
| Effort | 4 | 4 | 2 | 3 |
| Distinctiveness | 3 | 4 | 5 | 4 |
| Total (of 25) | 20 | 22 | 15 | 18 |
| Font status | Literata (pending client) | Alegreya (new proposal) | Noto Sans (new proposal) | Noto Serif (new proposal) |
| Deadline 16.11 | Partial, feasible | Most feasible | Not feasible in full | Template feasible |

The total is a convenience sum, not a decision: the axes are not equally important (a score of 5 in distinctiveness cannot compensate for a 2 in CMS fit when staff must fill all content).

## 7. Tools research

Retrieved on **05.11.2026**. Most sources are third-party blogs; where Google itself was reachable I say so. Pricing and limits drift, and every number should be re-checked in the product before relying on it.

### 7.1 Google Stitch

| Fact | Detail | Label and source (date) |
|---|---|---|
| What it is | Google Labs' "AI-native software design canvas": describe what you want in plain language and get high-fidelity UI screens | **Verified**: Google's own post, blog.google, 18.03.2026 (fetched 05.11.2026) |
| Inputs | Text prompts (business goal, feeling, inspiring examples); images, text or code added to the canvas as context; voice | **Verified**, same Google post. Image and sketch input is also reported by third parties (index.dev, 24.06.2025; uithings.com, 28.01.2026) |
| Outputs | Polished UI screens; **multiple variations** to explore; clickable prototypes (link screens, press Play); next-screen suggestions | **Verified**, same Google post (18.03.2026) |
| Canvas and agents | Infinite canvas; a design agent that reasons across the project's history; an "Agent manager" to track several ideas in parallel | **Verified**, same Google post |
| Design rules | `DESIGN.md`: an agent-readable markdown file of design rules, importable and exportable between tools; can extract a design system from a URL | **Verified**, same Google post |
| Developer path | A Stitch MCP server and SDK, plus community skills; export to developer tools such as AI Studio and Antigravity | **Verified**, same Google post |
| Figma | "Paste to Figma" for editable layers; whether it works in both generation modes is disputed between sources (one says Standard mode only) | **Inferred** (third parties: index.dev, almcorp.com, a Virginia Tech IT guide at it.aad.vt.edu). Google's page above does not mention Figma export. Test before relying on it |
| Code | HTML with Tailwind CSS is the most reported output; some sources add React or other frameworks | **Inferred** (third parties disagree) |
| Models and modes | Standard (faster) and Experimental (higher fidelity); model names differ by source and date (Gemini 2.5 Flash/Pro in older guides, Gemini 3.x in newer ones) | **Inferred**; **unverified** against Google |
| Limits | Most-reported monthly caps: 350 Standard and 50 Experimental generations; conflicting reports of 200 Experimental; since March 2026 some sources describe daily credits (one says 400 design plus 15 redesign credits per day, resetting at midnight UTC) | **Inferred / unverified**. A Virginia Tech IT page notes Google does not publish stable numbers; the count is shown inside the product after sign-in |
| Price and access | Free in Google Labs (reported by several third-party reviews, 2026) | **Inferred** (vp0.com pricing page, 2026; reviews at nocode.mba and others) |
| Official docs | `stitch.withgoogle.com/docs` returned only a title and topic headings when I fetched it, so I could not read specifics | **Verified** that I could not read them |

Sources: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/ (18.03.2026); https://stitch.withgoogle.com/ ; https://www.index.dev/blog/google-stitch-ai-review-for-ui-designers ; https://it.aad.vt.edu/howto/google-stitch/ ; https://vp0.com/blogs/google-stitch-pricing-plans-2026 ; https://www.neowin.net/news/google-updates-stitch-with-vibe-design-and-infinite-ai-canvas/ (could not be fetched, 403, only seen as a search result title).

**What Stitch cannot know about this project (Verified from the project documents; the reasoning that it follows is Inferred).** It does not know the 10-block single-column CMS, the plain-text body, the lack of per-person URLs, Kazakh-first content, the one-font rule, the client palette beyond hex values in the prompt, or the 4.5:1 contrast rule. It cannot load a self-hosted font; it will use a catalogue font by name, so a glyph check on its output is mandatory. It tends to add what the skill lists as anti-patterns (icons, pill buttons, three-card rows, gradients). **Therefore generated designs and exported HTML/Tailwind are NOT production-ready for this project**: they ignore the CMS block model, the Kazakh glyph and font constraints, accessibility and the existing tokens. Use them only as visual material for comparison and client conversation.

### 7.2 Alternatives that could help generate and compare concepts

| Tool | What it does for this task | Limits for this project | Label and source |
|---|---|---|---|
| **Figma plus the Figma MCP server** (available in this environment) | Real design file; the official remote MCP server (`https://mcp.figma.com/mcp`, OAuth) reads designs into code and, for write tools, writes to the canvas; `generate_figma_design` reported remote-only | Write tools need a Professional, Education, Organization or Enterprise plan with edit access (third-party report); credits and plan numbers vary by source. It is the place to build a **real component frame** (the 10 blocks at 375 and 1280 px) | **Inferred** (third parties: scalekit.com, banani.co, mcpservers.org, 2026). The MCP instructions in this environment confirm that tools exist for reading designs, generating them and editing files (**Verified**: tool description) |
| **Figma Make** | Prompt-to-prototype inside Figma using a team's own components and styles | AI credits: reports of a free tier with 150 credits per day capped at 500 per month, paid seats at 3,000 to 4,250 per month; conflicting | **Inferred** (banani.co, 2026) |
| **v0 by Vercel** | Prompt to React plus Tailwind components with live preview; GitHub sync; the free plan reported at $5 monthly credits | Output is Tailwind and shadcn-style React: this repo is hand-written CSS with no Tailwind (**Verified**: the audit describes 8k-line CSS; no Tailwind is mentioned), so the code cannot be dropped in. Figma import is reported as a paid feature; no Figma export | **Inferred** (uibakery.io, nxcode.io, costbench.com, 2026) |
| **Claude artifacts** | One prompt gives a single HTML or React prototype that can be opened and shared by link; good for testing a **layout with real Kazakh strings and a real font via embedded CSS** on a phone | Sandboxed viewer; reports of a 20 MB cap and no custom domain; sharing rules vary by plan. A third-party guide says artifacts can be published for public access. Anthropic's own help page was not read | **Inferred** (fast.io, static.app, 2026). One source mentions a separate "Claude Design" product in Labs; I could not confirm it (**unverified**) |
| **Lovable, Bolt, Framer, Uizard, Galileo** | Other generators and builders | Lovable and Bolt build full-stack apps (the stack differs from this repo); Framer publishes sites; Uizard is for wireframes; coverage of Galileo is thin | **Inferred** (superdesign.dev, banani.co, nxcode.io comparisons, 2026) |
| **Hand-coded static specimen in this repo** (Recommendation) | A single HTML page that loads the candidate fonts from `client/fonts/` and prints the nine Kazakh letters, names and body text at all scales | Needs the owner to add the font files (not done here) | **Recommendation** |

### 7.3 Recommended evaluation workflow

1. **Generate each direction from the same brief.** Give Stitch the same facts for all four: the palette hex values, the real Kazakh strings, the list of real images, the "no portrait, no audio, no counters" rules, and the direction's prompt (sections A.14 to D.14). Ask for 3 variations per direction. Record the tool, mode, date and prompt next to each result, because limits and models change. Do not feed it facts that are not in the code.
2. **Compare against `docs/design/FRONTEND_QUALITY_STANDARD.md`** (being written in parallel; read it before this step and reconcile any difference in thresholds with it, since it governs). Check at minimum: contrast per surface (4.5:1 body; the gold rules in section 1.3), body size 18 px, touch targets 44 to 56 px, names unbroken at 320 px, the nine Kazakh letters in the font used, no invented content, both themes, reduced motion, and one-column block fit. Reject any frame that invents a portrait, player, counter or form.
3. **Shortlist.** Keep at most two directions, or one base plus one borrowed template. Build only the base for the shortlist as a real component frame at 375 and 1280 px (Figma, or a Claude artifact) using the 10 real block types and real Kazakh text, including a very long name and a missing-image case.
4. **Client review.** Show the shortlist on a phone, in daylight if possible (outside, or by maximum brightness), to an older reader as well as the foundation staff. Ask three concrete questions: is it the same culture as the book cover; can you read the stele page standing; does the font feel right (Literata versus the direction's own family).
5. **Translate the winner into tokens and briefs.** Convert the choice into: a token set in `:root` (roles only, see `design-system` skill), one type scale, the header and menu brief, and per-template briefs (home, canon list, person, volume, stele page) in `docs/design/`, each starting `Status: draft` until the owner approves. Only then does the `frontend-engineer` build. Exported Stitch HTML is never merged.

## 8. Recommendation (labelled; the decision is the owner's)

**Recommendation.** If a single base is needed by 16.11.2026, take **B «Бағдарлама» as the foundation**, and borrow **D's stele page template** for the QR landing pages and **A's fact-sheet entry** for people and volumes, keeping the existing map component (restyled flat, in the spirit of A and C) on the home page. Do not attempt C as a whole before the deadline.

Reasons:
- **CMS reality.** B makes the single-column, plain-text, 10-block stack the style instead of a handicap (BACKEND_CAPABILITIES §10.1). It needs no new server work. A and D need small renderer changes; C needs a data model that does not exist.
- **Audience.** One column, 18 to 19 px type, no motion and no hidden interaction serve older readers, and a stele page built from D's order (name, short bio, photograph, next stele) serves the QR visitor. This addresses the audit's P0 and P1 findings about names, contrast, navigation and motion.
- **Honesty.** A and B degrade gracefully when portraits, audio and 300 of the 321 promised people do not exist; C and D lean harder on content that is missing (regions without data, per-stele pages).
- **Deadline.** B is the most feasible (Inferred: roughly 4 to 6 working days for tokens, header, home and the text template, before QA); D's template is a single additional template.

Trade-offs the owner should weigh:
- B uses Alegreya, a **different family from the client's pending Literata**. Alternatively, B's structure can be set in Literata (then it is A's typography with B's layout); I would then run the specimen test first, because Literata has an optical-size axis that Alegreya lacks. The font choice is separable from the layout choice.
- Hybrid means two or three templates, not one; it needs a single token layer and discipline so it does not become the current "nine differently styled sections".
- B's home page is quiet. If the client expects a strong image-led opening, D's opening (the monument photograph at full width) can replace B's masthead-only start.
- The dark theme: D is dark-led, and the contract names light as default. A hybrid keeps light as default and uses forest for the closing band and for the stele template by choice.

**Decision owner: the owner/main session.** Nothing here is approved.

## 9. Open questions for the owner

1. Is Literata approved, or is a direction-specific family acceptable? (A requires Literata; B, C, D propose another family.)
2. Are Һ/һ and the other Kazakh letters confirmed in the finalist's font by a render test? (Unverified for all candidates.)
3. Do you accept the optional `--gold-ink: #7A5F22` token, or must accent text on light be ink only?
4. Which theme is the default (the contract says light)? D is dark-led.
5. May the instrument contours act as map symbols (C) and as "tuning-line" dividers (B)?
6. Is the alley plan or site plan available from the client (needed for C and D)?
7. Can each stele get its own CMS page with a slug now, so a QR can point to it (D, and any direction's QR use)? Who authors those pages?
8. Which Kazakh interface strings in this file (marked "proposed copy") are approved?
9. Does the client accept the Stitch outputs as a conversation aid only?
10. After reading `docs/design/FRONTEND_QUALITY_STANDARD.md`, do any thresholds in section 1.3 need to change?

## 10. Out of scope

Code and CSS changes; adding fonts or dependencies; new CMS block types and storage (named only as consequences); admin UI design; content writing; logo changes; the Muragerler form (its fate is an owner decision, see audit); the Premium user tier; copy in Russian and English.
