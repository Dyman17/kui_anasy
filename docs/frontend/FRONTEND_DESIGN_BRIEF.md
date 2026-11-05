Status: draft

# Design brief — «Күй анасы» digital heritage portal and CMS

Audience of this document: an external AI design tool (Google Stitch) and the designers who review its output. It is written to be read **without access to the code repository**. All Kazakh strings are copied verbatim from the current product so that layouts are tested against real text lengths.

## How to read the tags

Every feature, page and data item carries one tag.

| Tag | Meaning | What the design must do |
|---|---|---|
| **[EXISTS]** | Supported by today's backend/CMS or present in the current frontend. | Design it as a working feature. |
| **[CONTRACT, NOT BUILT]** | Required by the signed contract but not implemented yet. | Design it as a **planned state**, clearly marked in the mock-up (for example a "planned" annotation or a visually distinct frame). Do not draw it as if it already works. |
| **[OPEN DECISION]** | The owner or the client has not decided. | Show the listed options side by side if useful. Do not choose. |

Rules for content:
- Never invent features, data or numbers. Where content is unconfirmed the design uses a neutral placeholder labelled **"placeholder — content pending client confirmation"**. The unconfirmed figures are deliberately **not repeated** in this brief.
- Sample strings below are used only to test length and glyph rendering. Historical names and dates in samples come from the current data file whose source review is pending.

---

## 1. Project overview and purpose

**The foundation.** «КҮЙ АНАСЫ» is a private non-profit foundation in Astana, Kazakhstan. It built the Күйшілер аллеясы (Alley of Küishis) and the bronze monument «Күй анасы — Дина» to Dina Nurpeisova (Дина Нұрпейісова) in Astana, and is preparing a three-volume academic collection «Ұлы дала әуенінің тұлғалары» (Personalities of the Great Steppe Melody).

**Mission.** Promote the traditional musical culture of the Kazakh people: küi (instrumental) art, zhyrau/zhyrshy epic art and traditional singing; digitise historical and cultural heritage; preserve and promote the legacy of Dina Nurpeisova and the traditional küishis; publish information about the foundation's projects.

**The product.** A digital educational and encyclopedic web portal with a content management system (CMS). Foundation staff — not developers — fill all content (text, photos, and in future audio and video). It is a single-page React application with a small API.

**Contract scope in one paragraph.** The contract (deadline 16.11.2026) requires: exactly six main sections (Басты бет, Тұлғалар, Музыкалық мұра, Жобалар, Цифрлық кітапхана, Қор туралы); three languages KZ | RU | EN with the three versions of an article linked by a shared identifier; two themes (light "old parchment" and dark "Түнгі дала"); a responsive layout for phone, tablet and laptop; an interactive map of historical regions and küi schools; QR codes (a "QR-код" button on every article, a free link field, PNG download); a central block on Dina Nurpeisova and a block on the project leaders; sub-pages with breadcrumbs; a two-tier admin (Super Admin and Editors whose work is published only after approval) with bulk approve and a full audit log. Anything not in this list (for example reader accounts, "Premium") is out of scope.

**Primary goal of the site for a visitor:** learn about and find a person, a book, a place or a recording of Kazakh traditional music, and arrive from a QR code at the physical alley.

**Tone (fixed by the client):** calm, historical, museum/editorial, readable, partly for older readers. Not playful, not salesy, not "tech startup".

---

## 2. Target audience

| Persona | Context and device | Needs | Design consequences |
|---|---|---|---|
| **Older reader** (core group named by the client) | Phone or tablet, sometimes a desktop; low tolerance for small type; may use browser zoom | Body text ≥ 18 px, line-height about 1.6, strong contrast, large tap targets, visible focus, gentle or no motion | No text below 14 px for content; targets ≥ 44 px; no auto-advancing content; no hover-only information |
| **QR visitor at the Alley or monument** | Standing outdoors on a phone, daylight glare, mobile data, arrives straight on a specific page (a hash link such as `#/kk/projects-alley`), probably with one hand | Know who/what the stele or monument is, practical information, then the way to deeper content | Photo-first, large type, high contrast, the page's key fact above the fold, lightweight images; works in both light and dark; deep links open in the right language |
| **Student / researcher** | Laptop or phone; reads long text; wants sources | Biography, dates, region and school, works, book volumes and chapters; search; citeable pages with stable URLs | Calm catalogue reading, clear metadata, source lines [OPEN DECISION: source policy], a stable link per item [CONTRACT, NOT BUILT for people] |
| **International visitor** (RU and EN readers) | Phone or laptop, little knowledge of Kazakh music, Latin or Russian reading | Orientation, a glossary, UI in their language; honest signalling when an article exists only in Kazakh | A visible "not translated" state; transliterated names; glossary links |
| **CMS editor at the foundation** | Office laptop; non-technical; Kazakh-language admin; edits text, adds photos | Create/edit pages from blocks, preview, send for review, see status | Plain, functional admin; clear status badges; no jargon; safe destructive actions |
| **Super Admin** (foundation chairman or delegate) | Laptop | Approve or reject edits, approve editors, see an audit trail | One-glance review queue, before/after diffs, bulk approve |

Language notes: Kazakh (kk) is the base language of all content. Russian and English currently translate the interface and some hard-coded pages only.

---

## 3. Product structure and sitemap

### 3.1 URL pattern **[EXISTS]**

Hash router: `#/<lang>/<slug>` where `<lang>` is `kk`, `ru` or `en` and `<slug>` is a single segment. A missing language prefix means "use the stored preference" (default `kk`). An empty slug means home. Examples: `#/kk` (home), `#/ru/people-kuyshi`, `#/en/projects-alley`, `#admin`, `#admin/pages`. Slugs are lowercase latin with hyphens; there are no nested paths. An unknown slug shows the 404 page.

### 3.2 Sitemap **[EXISTS]** (17 seeded pages, 6 top-level)

Primary navigation (six items, fixed order, contract rule: no other main sections):

| Order | Slug | Label kk | Label ru | Label en |
|---|---|---|---|---|
| 1 | `home` | Басты бет | Главная | Home |
| 2 | `people` | Тұлғалар | Деятели | Notable Figures |
| 3 | `heritage` | Музыкалық мұра | Музыкальное наследие | Musical Heritage |
| 4 | `projects` | Жобалар | Проекты | Projects |
| 5 | `library` | Цифрлық кітапхана | Цифровая библиотека | Digital Library |
| 6 | `about` | Қор туралы | О фонде | About Us |

Secondary pages (reached from section pages, the home page, the map, search; not in primary nav):

```
home                                  Ұлы дала әуені
people                                Тұлғалар
  people-kuyshi                       101 Күйші каноны
  people-zhyrau                       110 Жырау мен жыршы каноны
  people-anshi                        110 Дәстүрлі әнші каноны
  [person pages]                      [CONTRACT, NOT BUILT]  no URL today
heritage                              Музыкалық мұра        (no sub-pages; audio, notation: [CONTRACT, NOT BUILT])
projects                              Жобалар
  projects-alley                      Күйшілер аллеясы
  projects-monument                   Дина Нұрпейісова монументі
  projects-muragerler                 «Мұрагерлер» жастар үйірмесі
library                               Цифрлық кітапхана
  library-vol-1                       I том · «Күй әлемі»
  library-vol-2                       II том · «Ғасырлар үні»
  library-vol-3                       III том · «Ұлы дала әуені»
about                                 Қор туралы
  about-leadership                    Қор басшылығы мен ғылыми кеңес
  about-charter                       Қордың құрылымы мен міндеттері
(any new CMS page)                    created in the admin, always a child of one of the five sections
#admin ...                            separate full-screen admin application
```

**Structural limits [EXISTS]:** only two levels (section → page). An editor can create child pages under the five sections but cannot create a new top-level section. New CMS pages have no translated navigation label (they fall back to their Kazakh title).

**Utilities in the header [EXISTS]:** search, language switch (ҚАЗ / РУС / ENG), theme toggle, account entry (editors). Placement for Kazakh label lengths is an **[OPEN DECISION]** (see §16, OD-4): the current header does not fit in Kazakh between about 961 and 1280 px.

**Footer [EXISTS]:** brand blurb, section links, admin entry, copyright. A contact entry does not exist; the six-section rule has no place for it **[OPEN DECISION, OD-5]**.

---

## 4. Page-by-page specification

Common to all pages: the global shell (P00), a banner with breadcrumb on sub-pages, a footer. Text samples are verbatim.

Data-source vocabulary: **CMS blocks** = served by the API as an ordered list of blocks (editable by staff). **Frontend constants** = text and data written in the application code (not editable by staff; changes need a developer). **None yet** = nothing exists.

Important system fact for designers: 11 of the 17 pages are currently drawn from frontend constants, so staff edits in the admin do not change them. The contract requires that all content be editable, so every such page is a **[CONTRACT, NOT BUILT]** migration to blocks; the design must therefore be buildable from the block types in §5 plus the planned ones.

### P00 — Global shell (header, mobile menu, footer)

| Item | Specification |
|---|---|
| Purpose | Orient, switch section, language, theme, search. |
| Content | Brand: wordmark «Күй анасы» with emblem and subtitle «ЦИФРЛЫҚ ЭНЦИКЛОПЕДИЯ» **[EXISTS]**. Six nav labels (§3.2). Language switch ҚАЗ / РУС / ENG. Search trigger. Theme toggle (names: «Түнгі дала» for dark, «Жарық» for light). Account entry «Кіру». Mobile menu rows have a one-line description; samples: «Басты парақша және бағдарлама», «Аудио архив және дәстүрлі музыка», «Күйшілер аллеясы мен монумент», «3 томдық академиялық басылым», «Қор жарғысы мен ғылыми кеңес» (some descriptions contain counts that are unconfirmed — use neutral text). |
| Source | Frontend constants (labels in kk/ru/en) **[EXISTS]**. |
| Components | Header bar, primary nav, language group, icon buttons, full-screen mobile menu, search dialog, footer columns, left ornament rail (client-required, 64 px desktop, about 28 px mobile, decorative, never covers content). |
| Interactions | Active section highlighted also when on its child page. Mobile menu is a modal dialog (Esc closes, focus stays inside, returns to the trigger). Language change keeps the current slug and rewrites the URL prefix. Theme persists across visits. |
| States | Search open/empty/results/no-results; menu open/closed; logged-in vs anonymous account control. |
| Mobile | ≤ 960 px the nav and the language group move into the menu. Targets ≥ 44 px. The theme control label must not wrap awkwardly («Түнгі дала»). |
| Notes | The login entry is visible to all readers today **[OPEN DECISION, OD-4b]**: keep in header, move to footer, or hide behind a direct `#admin` address. |

### P01 — Home (`home`) — hybrid **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose / task | Introduce the foundation and Kazakh music; route to people, music, library, the Alley; show the map. |
| Content inventory | 1) Hero: kicker «Қазақ музыка мұрасының цифрлық орталығы»; title «Күй анасы.» + emphasised «Ұлы дала әуені.»; lead «Қазақтың дәстүрлі музыка мұрасының цифрлық энциклопедиясы. Өнер иелері, күйлер, жырлар мен ғасырлардан жеткен әуендер.»; two actions «Тұлғалар бөлімі» (primary) and «Музыкалық мұра»; a photograph set (alley arch, monument, stele). 2) **Central Dina Nurpeisova block** (contract): eyebrow «ТҰЛҒА · 1861–1955», title «Дина Нұрпейісова», about 60 words, a monument photograph with caption «Дина Нұрпейісова ескерткіші · Астана», link «Тұлғалар каталогы». 3) Heritage map (§6.5). 4) A figures band (four numbers with labels; the values are **placeholder — content pending client confirmation** except where the client confirms). 5) Intro quote «Ұлттың рухани коды» with about 45 words and link «Қор туралы», plus an illustration (provenance unknown **[OPEN DECISION, OD-7]**). 6) Project leaders (contract): three people, e.g. «Қуанышев Төлеген Шағытбайұлы» — «Қор құрылтайшысы · Жоба жетекшісі»; «Жетібаев Ерзат Жетібайұлы» — «Ғылыми кеңесші · Бас сарапшы»; «Жалын Бауыржан» — «Мүсінші · Монументалист суретші»; each with a 30–50-word bio and photo (one photo exists; two are initials). 7) Photo gallery of the Alley, 8 items, e.g. «Күйшілер аллеясының бас қақпасы», «101 Күйші канондық стеласы» (§6.6). 8) Muragerler promo: ««Мұрагерлер» жастар үйірмесі» with slogan ««Мұраны сақта, жаңғырт, дамыт!»» and four directions: «Дина атындағы стипендия», «Ашық аспан концерттері», «Тәлімгерлік шеберлік сабақтары», «Фольклорлық экспедициялар» **[the claim "scholarship" etc. is client-described; see P09]**. 9) Closing call to action «Қазақ музыкасының үш томдық жинағы.» → «Кітапхананы қарау». Contract also lists a **media library** on home **[CONTRACT, NOT BUILT]** (audio/video do not exist yet). |
| Data source | **Hybrid.** Hero lead, Dina block, figures band, intro quote and a cards block come from CMS blocks; the hero text keys, gallery, leaders, Muragerler, map, tooltips are frontend constants. **[EXISTS]** for display; editing is **[CONTRACT, NOT BUILT]**. |
| Components | Hero with photo set, feature block with photograph, map with region panel, figures band, quote with illustration, person-profile cards (leaders), gallery, promo panel, CTA band. |
| Interactions | Hero photo set (manual control required; no auto-advance recommended, see §14). Name tooltips on historical names (hover/focus; **must have a touch equivalent**). Map interactions §6.5. |
| States | Loading (brand screen «Жүктелуде…»); API-down → bundled content (§9). Section shown only if its data exists (e.g. no figures block → no band). Not translated: hero strings exist in all three languages; other text on this page stays Kazakh in RU/EN today (mixed) — design a consistent treatment. |
| Mobile | One dominant element per screen. Hero stacks: text first, photo second. Map: points small; region list is the primary control; all targets ≥ 44 px. Leaders become a vertical list. |

### P02 — Section index template (`people`, `heritage`, `projects`, `library`, `about`) — CMS **[EXISTS]**

One template, five instances. Banner (kicker for parent, title, description, breadcrumb) → block stack → auto list of child pages («ОСЫ БӨЛІМДЕГІ БЕТТЕР» / «Бөлім материалдары (3)») → global call-to-action.

| Instance | Title and description (kk) | Notes |
|---|---|---|
| `people` Тұлғалар | «Күйшілер, жыраулар мен дәстүрлі әншілердің өмірі, шығармашылығы және өнер сабақтастығы.» | Contains a block promising a "digital passport" for each person (portrait, years, teacher, works, audio, personal QR). That passport does **not exist**: **[CONTRACT, NOT BUILT]**; present it as a planned state or omit. Three child cards lead to the canons. |
| `heritage` Музыкалық мұра | «Күйлер, әндер мен жырлар — халықтың тарихы мен дүниетанымын сақтаған рухани қазына.» | No children and no audio today. The contract requires history of küis, **sheet music** and **audio recordings**: **[CONTRACT, NOT BUILT]**. Design as a planned listening/notation area with an honest empty state. |
| `projects` Жобалар | Section index with cards for Alley, monument, Muragerler | Child cards today are text-only. |
| `library` Цифрлық кітапхана | ««Ұлы дала әуенінің тұлғалары» үш томдық жинағы, монографиялар, ноталар мен архив құжаттары.» | The library shelf: three volumes. Child cards currently have no covers; covers exist (see P06). Notation and archive documents: **[CONTRACT, NOT BUILT]**. |
| `about` Қор туралы | Section index for leadership and charter | |

Child card today: title, description (about 15–25 words), a label showing the number of blocks in the page («7 модуль») — **jargon; do not show**; link «Оқу».
Mobile: block stack is a single column already; child list one per row.
States: no blocks → «Нәтиже табылмады.» message (replace with a proper empty state); no children → section omitted.

### P03 — People canon pages (`people-kuyshi`, `people-zhyrau`, `people-anshi`) — frontend constants **[EXISTS]**, content editing **[CONTRACT, NOT BUILT]**

| Item | Specification |
|---|---|
| Purpose / task | Browse and find a person; read a short biography and works; reach their region. |
| Titles | «101 Күйші каноны», «110 Жырау мен жыршы каноны», «110 Дәстүрлі әнші каноны». The numbers in the titles are the planned canon sizes; the data currently holds only **9 küishis, 7 zhyraus and 7 anshis**. The design must handle a list that is far shorter than its title and that will grow towards about 100 per canon **[OPEN DECISION, OD-16]**: show the true count, hide the number, or label it "in preparation". |
| Record fields | `name`, `dates`, `region`, `school` (filter id) and `schoolName` (label), `kuis[]` (titles of works), `bio` (30–40 words today), `img`. |
| Real samples | «Құрманғазы Сағырбайұлы» · 1818–1896 · «Батыс Қазақстан, Бөкей ордасы» · school «Төкпе күй дәстүрі» · works «Сарыарқа», «Адай», «Серпер», «Кісен ашқан», «Түрмеден қашқан», «Балбырауын». «Дәулеткерей Шығайұлы» · 1820–1887. «Тәттімбет Қазанғапұлы» · 1815–1862 · «Сарыарқа, Қарақаралы» · «Шертпе күй мектебі». «Қазанғап Тілепбергенұлы» · «Арал өңірі, Сыр бойы». Zhyrau: «Асан қайғы Сәбитұлы» · «XIV–XV ғғ.» · «Алтын Орда, Дешті Қыпшақ»; «Бұқар жырау Қалқаманұлы» · 1668–1781; «Махамбет Өтемісұлы» · 1804–1846. Anshi: «Біржан сал Қожағұлұлы» · 1834–1897 · «Арқа ән мектебі»; «Ғарифолла Құрманғалиев» · 1909–1993 · «Батыс дәстүрі». Longest name pattern: patronymic plus surname, about 25–30 characters. Date formats vary (year ranges, centuries). |
| Filters | Per canon school filters, e.g. kuyshi: «Барлығы (101)» [count is wrong today], «Батыс (Төкпе дәстүрі)», «Арқа (Шертпе дәстүрі)», «Қаратау & Сыр бойы», «Жетісу & Шығыс». Free-text search: placeholder «Есімі, өңірі немесе шығармасы бойынша іздеу...». |
| Portraits **[OPEN DECISION, OD-2]** | **No real portraits exist.** The current images are stele photos, book covers and an alley photo, which is wrong (rule: no invented portraits). Options: (a) a neutral no-image card with name and region; (b) a typographic monogram; (c) real archival portraits supplied by the client with credit lines. Design must work with option (a) as the baseline. |
| Components | Search field, filter chips, person list/card, works list, detail trigger, empty state, bottom link back to «Тұлғалар». |
| Interactions | Filter by school, search by name/region/work title (client-side over this list only). Open the person detail (P04). Arrival from the map can open a specific person's detail. |
| States | Loading n/a (static). Empty: «Бұл санат бойынша ешқандай тұлға табылмады.» with action «Сүзгілерді тазарту». Not translated: only küyshi has ru/en filter labels; masters' bios are kk-only → show the kk text with a "not translated" marker. |
| Mobile | The card must never squeeze the name: stack the portrait (or no portrait) above or beside only if the name column keeps ≥ 60 % of the width. Names never break mid-word (§8). Filters scroll horizontally or wrap; search placeholder must not truncate to nonsense (shorter placeholder). |

### P04 — Person detail, today a modal **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose | Read the full short biography and list of works of one person. |
| Content | Eyebrow = school name; name (h2); line «1818–1896 · Батыс Қазақстан, Бөкей ордасы»; heading «Өмірбаяны мен шығармашылық мұрасы» + bio; heading «Шығармалары мен туындылары:» + work chips. |
| Source | Frontend constants. |
| Components | Dialog with proper semantics (labelled title, Esc to close, focus trap, focus return), close control. |
| States | Opened from list or from the map. Missing image: no placeholder image, just text layout. Long work lists wrap. |
| Mobile | Full-screen sheet, scrollable, large close target. |
| Note | The modal has no URL, so it cannot be shared or linked from a QR code. The planned replacement is P05. |

### P05 — Person page with its own URL **[CONTRACT, NOT BUILT]**

Planned, because the contract requires a QR button on every article and trilingual article versions linked by an identifier, which needs addressable articles. Design as a **planned state**.

| Item | Specification |
|---|---|
| Purpose | A citeable, shareable, QR-addressable page about one person. |
| Proposed fields (from the architecture plan, not decided) | Name, years, region, school, status, teacher and students (only if confirmed), biography (long text), works with optional audio, portrait with credit, archive sources. Each field optional; missing fields are hidden, never filled with guesses. |
| Components | Name and dates header, metadata list, biography text, works list, audio block (§5.2), gallery, QR button + PNG download, language tabs with a "not translated" notice, related region link, breadcrumbs. |
| URL | `#/<lang>/<slug>` with a slug of one segment (nested paths are not supported). |
| States | Not translated, no portrait, no audio, unpublished (never visible to the public). |

### P06 — Library volume pages (`library-vol-1`, `-2`, `-3`) — frontend constants, kk only **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose / task | Describe one volume; let a researcher decide whether it has what they need. |
| Content | Cover (real covers exist: «Күй әлемі», «Ғасырлар үні», «Ұлы дала әуені»); volume label «I ТОМ»; title ««Күй әлемі» (Күйшілер антологиясы)»; lead (about 40 words); metadata: size, year, ISBN, editors, format — **all metadata values are placeholder — content pending client confirmation**; chapters list: «I БӨЛІМ — Батыс Қазақстанның төкпе күй дәстүрі» with a page range and a one-line description (page ranges unconfirmed). Note: the cover of vol. I reads "100 КҮЙШІ" while the copy says 101 — design must not print counts until confirmed. |
| Actions | «Кітапты онлайн оқу» opens a "reader" modal showing 2 sample pages of site-written text. That is **not the book** and must not be designed as a reader of the volume. Real reading/PDF download: **[CONTRACT, NOT BUILT]** (R2 file storage). The current "download" is the cover image only; label it honestly. **[OPEN DECISION, OD-14]**: remove the sample reader or replace by a real PDF/viewer when files exist. |
| Components | Metadata card with cover, definition list, chapter list, primary action (planned: read/download), bottom link «← Цифрлық кітапхана». |
| States | No PDF → show "digital edition pending" state, not a fake button. Not translated: whole page kk-only. |
| Mobile | Cover above metadata; metadata two columns collapsing to one at 375 px; ISBN strings may wrap. |

### P07 — Alley (`projects-alley`) — frontend constants, kk/ru/en **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose / task | Primary destination for QR visitors at the Alley. Know where I am, what each part is, how to visit. |
| Content | Banner «Күйшілер аллеясы», lead «Елорда төріндегі қазақтың күйшілік өнеріне арналған бірегей сәулеттік мәдени кеңістік. …» Four zones: «Салтанатты бас қақпа (Арка)», «101 Күйші стелалары», «Дина Нұрпейісованың монументі», «Амфитеатр және демалыс аймағы» (each about 30 words, with photo). Stele catalogue grouped by school (19 names currently, e.g. «Құрманғазы Сағырбайұлы 1818–1896», «Сейтек Оразалыұлы 1861–1933», «Мәмен Ерғалиұлы 1868–1931»). **Stele numbers («СТЕЛА №01») are placeholder — content pending client confirmation.** Visitor information: address, opening hours, public transport. **All visitor information values are placeholder — content pending client confirmation.** An "interactive QR guide with audio recordings" is mentioned in current copy; audio does not exist: **[CONTRACT, NOT BUILT]**, show as planned. |
| Layout intent | For QR visitors the practical block (where, hours) and "which stele am I at" must be reachable at the top on a phone. Recommended order for the design to test: banner → visitor facts → zones → stele catalogue **[Recommendation]**. |
| Components | Banner, zone cards with photo, school filter, stele catalogue list, facts list, bottom navigation between Alley and monument. |
| States | Filter with no result; photo missing; ru/en lists are shorter than kk (some labels stay Cyrillic in the English version today — treat as defect). |
| Mobile | Phone daylight use: ≥ 18 px body, contrast ≥ 7:1 for key facts, large tap targets. |

### P08 — Monument (`projects-monument`) — frontend constants, kk/ru/en **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose / task | Understand the monument to Dina Nurpeisova (arrival from a QR code at the monument). |
| Content | Banner «Дина Нұрпейісова монументі»; lead «Қазақтың даңқты күйші-композиторы, Құрманғазының батасын алған дәулескер әйел Дина Нұрпейісованың елордадағы қола мүсіні. …»; section «Мүсін және мүсінші талдау» → «Монументтің көркемдік ерекшеліктері» (four details with photographs); authors named in the current copy (Жалын Бауыржан; co-authors Болатбек Еркебайұлы, Аманжол Бекенұлы); selected küis of Dina, e.g. «Бұлбұл», «16 жыл», «Әсемқоңыр», «Тойбастар», «Науайы», «Қарақасқа ат» (the tempo/story notes are unconfirmed); dedication plaque photo. |
| Components | Banner, photo-led detail blocks, works list, quote, link to Dina in the canon. Planned audio of the küis **[CONTRACT, NOT BUILT]**. |
| States / Mobile | As P07. Single dominant photograph per screen. |

### P09 — Muragerler youth club (`projects-muragerler`) — frontend constants, kk/ru/en **[EXISTS]**; real submission **[CONTRACT, NOT BUILT]**

| Item | Specification |
|---|---|
| Purpose / task | Learn what the club is; (planned) apply to join. |
| Content | Title ««Мұрагерлер» жастар үйірмесі»; slogan ««Мұраны сақта, жаңғырт, дамыт!»»; four directions (names above); an impact-figures row (**placeholder — content pending client confirmation**, no numbers repeated here); programme directions, mentors (names, roles, bios — unconfirmed), a weekly schedule (unconfirmed), FAQ (e.g. eligibility), application form with fields: name, age, phone, direction, experience, note. |
| Form status **[OPEN DECISION, OD-9]** | The form currently stores the entry only in the visitor's own browser and shows "accepted". No server endpoint and no admin inbox exist. Options: (a) build a real submission (endpoint + admin inbox) — design the form with success/error states as **[CONTRACT, NOT BUILT]**; (b) remove the form and show contact details or a closing note. Fake success is prohibited. |
| Components | Banner with anchor links, figures row, direction picker, mentor cards, schedule table, FAQ accordion, form. |
| States | Form: idle, validation error (inline, not browser `alert`), submitting, success, server error, offline. Schedule empty → hide. |
| Mobile | Anchor links stack; schedule becomes a list; form fields full width with 16 px minimum type. |

### P10 — Leadership (`about-leadership`) — frontend constants, kk only **[EXISTS]**

Title «Қор басшылығы мен ғылыми кеңес». Content: founder profile (photo, name «Қуанышев Төлеген Шағытбайұлы», role, bio, a quote), then three council/team profile cards. Components: profile header, quote, profile cards. States: person without photo (monogram or none; **[OPEN DECISION, OD-2]**), not translated (kk only). Mobile: stacked profiles. Editing: **[CONTRACT, NOT BUILT]**.

### P11 — Charter (`about-charter`) — frontend constants, kk only **[EXISTS]**

Title «Қордың құрылымы мен міндеттері». Content today: a mission paragraph and three objectives (cultural sites, publishing and digitisation, support of the youth club), about 35 words each. It is **not** a charter document: it has no legal text. Planned: documents (PDF) **[CONTRACT, NOT BUILT]** — the contract says "documents" belong to the About section. Components: statement block, objectives list, planned document list with download. States: no documents → hide. Mobile: single column.

### P12 — CMS standard page (any child page) **[EXISTS]**

| Item | Specification |
|---|---|
| Purpose | The template for every page staff create: banner + blocks + list of its own children + closing call to action. |
| Content | Banner: parent kicker (e.g. «ТҰЛҒАЛАР»), title (≤ 120 characters), description (≤ 1000, usually 20–40 words), breadcrumb. Blocks: §5. |
| Components | All 10 block types (§5.1). |
| Interactions | Child cards are links (the whole card). |
| States | No blocks → empty message; unpublished page never visible to readers; a page whose editor draft is pending shows only the published version to readers. |
| Mobile | One column; images full width; cards one per row. |
| Constraint | Body text is a single plain paragraph (no bold, links, sub-headings); long text is split over several blocks. Design for single-paragraph lengths up to 12 000 characters, with comfortable paragraph rhythm. |

### P13 — Search **[EXISTS]** (client-side)

| Item | Specification |
|---|---|
| Purpose / task | Find a page by words. |
| Behaviour | Modal dialog opened from the header (also `/` or Ctrl+K). Matches page title, description and block title/body of the pages loaded in the browser, case-insensitive. Results are pages, each with a title and the parent section name. Placeholder «Тұлғаларды, күйлерді немесе материалдарды іздеу...» (promises more than the search does: it **cannot** find a küishi, a küi title or a book chapter that lives in the canon, volume or alley pages — **[OPEN DECISION, OD-13]**: extend search scope (needs data in the CMS) or reword the placeholder). |
| Initial state | «Жиі ізделетін бөлімдер:» with four shortcut links (canon, Alley, vol. I, leadership). |
| States | Empty query; results; none: «Нәтиже табылмады.» + «Басқа атаумен немесе күйші есімімен қайталап көріңіз.». Unpublished pages are **not** searchable in practice: the browser loads only the public (published) page list, even for logged-in editors. Canon, volume, Alley, monument and Muragerler pages are found only through their CMS placeholder blocks, whose wording differs from what the page shows. |
| Interactions | Arrow keys through results, Enter opens, Esc closes, focus is trapped and returned. |
| Mobile | Full-screen sheet; keyboard-safe input; large result rows. |

### P14 — 404 **[EXISTS]**

Kicker «404», title «Бет табылмады», text «Сұралған мекенжай бойынша бет жоқ. Сілтеме ескірген немесе қате терілген болуы мүмкін.», action «Басты бет». ru/en strings exist. Shown inside the normal site shell. Could add links to the six sections and search (design suggestion). Mobile: single column.

### P15 — Admin: login **[EXISTS]**

Separate full-screen application at `#admin`; Kazakh only. Heading «Басқару жүйесі», text «Энциклопедия мазмұнын өңдеу немесе жаңа парақшалар енгізу үшін жүйеге кіріңіз.» Two tabs: «Бас әкімші» (master key, shared by everyone who holds it; stored only on the server) and «Редактор / Әкімші» (own account). Super Admin: one password field «Бас әкімшінің құпия кілті (Master Secret Key)», helper text about environment storage; button «Кіру». Editor: fields «Логин», «Құпиясөз»; button «Кіру»; switch «Аккаунтыңыз жоқ па? Тіркелу». States: idle, busy «Тексерілуде…», wrong credentials (error banner), not yet approved (info message), too many attempts (429), API not connected (buttons disabled with explanatory message «Сервер (API) қосылмаған. Әкімші панелі тек сервермен жұмыс істейді.»). Top bar: brand, «← Сайтқа қайту». Mobile: single card.

### P16 — Admin: register **[EXISTS]**

Same view in editor mode «Тіркелу»: fields «Аты-жөніңіз (ФИО)», «Логин» (3–40 chars, a–z 0–9 . _ -), «Құпиясөз» (min 8); button «Тіркелуге өтініш беру». Registration is open to anyone: there is no invitation, no email, and no rate limit on this form (only login attempts are limited: 10 failures per 15 minutes per address). Success: account is created as "pending approval" and cannot log in until the Super Admin approves; the existing message is «Өтінішіңіз сәтті қабылданды! Бас әкімші мақұлдағаннан кейін жүйеге кіре аласыз.». Errors: username taken (409), validation (400). No self-service password reset exists **[not in contract]**.

### P17 — Admin: page list **[EXISTS]**

Tab «Беттер (N)». Heading «Беттер», text «Бетті таңдап өңдеңіз, мақұлдаңыз немесе сақтаңыз.» Status filters: «Барлығы (N)», «Қаралуда (N)», «Жарияланғандар (N)». Super Admin: select-all and «Таңдалғандарды бірге бекіту (N)». Page row: section tag, status badge («Қаралуда (Күтуде)», «Қабылданбады», «Жарияланған · өзгерістер қаралуда», «Жарияланған»), slug `/people-kuyshi`, title, description, author/approver lines with dates, change summary, buttons «Бекіту», «Қабылдамау» (Super Admin when pending), «Өңдеу». A notice appears on pages still drawn from code: «Бұл бет әзірге код арқылы көрсетіледі: мұндағы өзгерістер сайтта көрінбейді. …» — this is a temporary honest state and disappears when the migration is done. Any approved editor sees and may edit every page, not only their own (there is no ownership). Editor notice: «Сіз Редактор мәртебесіндесіз. Сіз енгізген өзгерістер Бас әкімші бекіткеннен кейін ғана сайтта жарияланады.» Empty: «Бұл санатта беттер жоқ» + «Бет құрастыру». No delete, no reorder **[not in contract]**. Mobile: rows stack; actions wrap.

### P18 — Admin: block editor **[EXISTS]**

Tab «Жаңа бет» / «Өңдеу». Left panel «Модульдер» lists the 10 block types (button adds a block at the end). Canvas: page settings (section select, «Бет атауы», «Қысқаша сипаттама», «Енгізілген өзгерістер сипаттамасы (Журналға жазылады)», generated link line «Сілтеме: /slug»), then block cards numbered 01, 02… with per-type fields (§5.1), up/down/delete controls. Toggle «Алдын ала көру» shows the public rendering. Primary action: «Бекіту және жариялау» (Super Admin) or «Қарауға жіберу» (Editor). Empty: «Бет әлі бос — Сол жақ панельден модуль таңдаңыз». States: saving «Сақталуда…», success notice, error alert, sent-for-review notice. Gaps: no image upload (URL/path only), no audio/video, no language tabs, no drag-and-drop, no delete page: all **[CONTRACT, NOT BUILT]** where the contract requires them (media, languages). Mobile: editor is a desktop task; must remain usable at 768 px; phones are not a target for the builder.

### P19 — Admin: moderation (review and approve) **[EXISTS]**

Not a separate screen: it lives in the page list (P17) and the editor. Editor edits of a published page become a hidden draft («Жаңа нұсқа: <author> (<date>) — <summary>»); the public still sees the old version. Super Admin approves one or many in a single operation, or rejects with a reason (currently a native prompt; design a proper dialog). The reason is stored only in the audit log: it is not shown on the page row and the editor never sees it. A rejected draft of a published page is simply discarded (the live page stays); a rejected never-published page becomes «Қабылданбады» and returns to «Қаралуда» when the editor saves it again. Each published page has only one draft slot: a second editor save replaces the first unapproved draft. Only the Super Admin role exists above editors, and all key holders share one identity («Бас әкімші»). Needed design: a review view that shows the draft against the live version (before/after) **[Recommendation]**; the current UI does not show a diff in the list. Status vocabulary: published, pending, rejected, "published with changes in review".

### P20 — Admin: audit log («Журнал», Super Admin only) **[EXISTS]**

Chronological list, newest first, 100 per load with "load more". Each row: time, actor name and role, action label, target (slug or username), summary, and, for page updates, a one-line change summary (changed title, description, section, module count before → after). The server stores full before/after content, but the current UI does not show it as a diff. Filter by target. Actions recorded include logins, editor registered/approved/deleted, page created or updated (published or submitted), approved, bulk-approved, rejected. Empty and error states required. Mobile ≤ 640 px: rows stack.

### P21 — Admin: editor accounts («Әкімшілер», Super Admin only) **[EXISTS]**

Title «Әкімшілер мен Редакторлар», text «Сайтқа тіркелген редакторларға рұқсат беру немесе өшіру.» Rows: full name, login, registered date, status badge («Мақұлдауды күтуде» / «Рұқсат берілген»), buttons «Рұқсат беру», delete (with confirmation). Empty: «Тіркелген редакторлар жоқ». There is no "reject registration with reason", only delete (a native confirm dialog today); delete also works on approved editors and ends their sessions. There is no way to suspend an account without deleting it, and no password change or reset.

**Page count specified: 22 entries (P00 shell + P01–P21), of which 5 are section pages sharing one template, 3 are canon pages sharing one template and 3 are volume pages sharing one template.**

---

## 5. The CMS block system

### 5.1 Today: exactly 10 block types **[EXISTS]**

Blocks are stacked in a single column in a fixed order; editors can reorder, add and delete. No grid, columns or tabs. Shared fields: `title` (≤ 300 characters), `body` (plain text ≤ 12 000 characters, one paragraph). Optional: `eyebrow` (≤ 200), `link` (site-relative or http(s)), `linkLabel` (≤ 200), `items` (≤ 100 free-form entries). At most 100 blocks per page.

| Type (admin label) | Editor fields | What the visitor sees today | Design must cover |
|---|---|---|---|
| `heading` («Бөлім тақырыбы») | eyebrow, title, body | Currently identical to `text` | A distinct section-opening style |
| `text` («Мәтін») | title, body, link (link is stored but not shown) | Kicker, h2, paragraph | Long-form reading style, 55–75 characters per line |
| `feature` («Ерекше тақырып») | eyebrow, title, body, link (not shown) | Same as `text`; alternate blocks are offset | A highlighted opening statement |
| `quote` («Дәйексөз») | title = attribution, body = quote | Large quotation marks «», attribution | Pull-quote with source line; note that `«»` are added by the component, so editors must not type them |
| `image` («Сурет») | title = alt text, link = image URL or path, body = caption | Figure with caption | Caption and credit style; empty/missing image state; landscape and portrait |
| `list` («Тізім») | title, body, items[].text | Heading, intro, bullet list | Bullets up to 100 items; long items |
| `stats` («Сандар») | items[].value, items[].label | Numbered figures 01, 02, … | Figures with labels; ≤ 6 figures typical; values only when confirmed |
| `cards` («Карточкалар») | title, body, items[].title, .meta, .description | Grid of cards, each with an image chosen by code (not editable) | Card with tag, title, description, optional image; one block of 3–5 cards; **cards are not links on standard pages** (the home page uses a hidden `slug` per card) |
| `callout` («Екпінді блок») | eyebrow, title, body, link, linkLabel | Highlight box with one link button that opens in a new tab | Emphasis box with one action |
| `qr` («QR сілтеме») | title = caption, link = absolute http(s) URL | QR image created in the browser, caption, copyable link | QR with caption and copy action; PNG download is planned |

Also rendered on every standard page (not a block): banner, breadcrumb, list of child pages, global call-to-action.

### 5.2 Planned blocks **[CONTRACT, NOT BUILT]** (design as planned states)

| Block | Why | Notes |
|---|---|---|
| `audio` | Contract: audio recordings of küis | Plays from file storage (planned Cloudflare R2). Needs title, performer, duration, transcript/credit. Honest "recording pending" state. |
| `video` | Contract: videos from the foundation's YouTube channel, played on the site | Embed by video id; poster and caption. |
| Media upload field | Contract: staff add photos, documents, audio without code | Upload, progress, error, size limit states in the editor. |
| `person` / person page | Per-person addressable article, QR | See P05. |
| `gallery` | Contract mentions a media library | Photo set with captions and credits. |
| `document` / PDF download | Contract: documents (About), books (Library) | Title, size, language. |
| Language versions of every block | Contract: KZ | RU | EN versions linked by a shared id; language tabs in the admin | A "not translated" state and a fallback to Kazakh with a notice. |
| `faq`, `schedule` | Currently hard-coded on the Muragerler page; editors will need them once content moves into the CMS | **[OPEN DECISION]** whether they become blocks. |
| Rich text in `body` | Long articles need paragraphs, emphasis, links | **[OPEN DECISION, OD-11]** |

---

## 6. Functional and interaction requirements

### 6.1 Search **[EXISTS]**
Client-side, CMS pages only (title, description, block title and body). Does not search people, küis or books stored in code. Details in P13. Server-side or entity search is **[OPEN DECISION, OD-13]**.

### 6.2 Language switching **[EXISTS] partly**
- Languages: `kk` (base), `ru`, `en`. The switch changes navigation and interface text and rewrites the URL prefix (`#/ru/...`); a shared link therefore opens in the right language.
- Article content from the CMS is **Kazakh only**; RU/EN article translations and the shared-id model are **[CONTRACT, NOT BUILT]**. Some hard-coded pages have RU/EN text (Alley, Monument, Muragerler, map labels); others are kk-only (volumes, leadership, charter, canon biographies).
- The design must therefore define a **"not translated" pattern** (a clear notice that the text is shown in Kazakh, with a way to go back) and must be built for strings of very different lengths in three languages.
- Who provides RU/EN translations is unknown **[OPEN DECISION, OD-10]**.
- The page's `lang` attribute follows the chosen language; the title follows the page.

### 6.3 Theme **[EXISTS]**
Two themes: **Light** (parchment canvas, dark green text, antique-gold accents) and **Dark «Түнгі дала»** (deep green canvas, parchment text, gold accent). Toggle in header; choice persists. Both themes are required on every page and component. The contract wants a **gradient** page background in the dark theme **[OPEN DECISION, OD-6]**: exact stops are unknown (an earlier proposal: from `#0B1C15` to `#10291F` to a slightly lighter green).

### 6.4 QR codes
- A `qr` block that generates a QR in the browser from an http(s) link and shows a copy-link row **[EXISTS]**.
- A **"QR-код" button on every article**, a **free link input field** (anyone can paste a link and get a QR) and **PNG download** **[CONTRACT, NOT BUILT]**. Design these as planned states: button on the article header, a dialog or panel showing the QR with link, "Download PNG" and "Copy link".
- A `qr` block accepts only an **absolute** `http(s)` URL (the server rejects site-relative or `#/...` links for QR). A QR to a page of this site therefore needs the full address including the domain, which is not chosen yet (`kuianasy.kz` or `kuianasy.com`) and is the form `https://<domain>/#/<lang>/<slug>`. The planned per-article QR button must build this full address itself.
- QR codes at the alley and monument are physical objects outside this product; the pages they open are P07 and P08.

### 6.5 Interactive map **[EXISTS]** (contract feature)
- Schematic outline of Kazakhstan ("schematic map · borders are approximate") with nine region markers: «Бөкей Ордасы», «Сарайшық / Атырау», «Маңғыстау», «Шалқар / Арал», «Қаратау / Түркістан / Отырар», «Ұлытау / Жезқазған», «Сарыарқа / Қарқаралы», «Тарбағатай / Алтай», «Жетісу».
- A side list repeats the regions with the count of küishis in each (some regions have a count, some «—»).
- Selecting a marker or a list item zooms slowly into the region and opens küishi cards for that region (name, years, status, famous küis, a button to their article). A button «Картаны толық көру» returns to the full view.
- Four regions have no data (Сарайшық, Маңғыстау, Ұлытау, Тарбағатай) and show an honest "information is being compiled" message; data must come from the client **[OPEN DECISION, OD-3b / needs client data]**.
- Markers are keyboard-operable with labels and a live region announces the selection. Reduced motion is respected.
- Planned: the button to the article leads to a person page **[CONTRACT, NOT BUILT]** (today it opens the canon page with the person's modal).

### 6.6 Galleries and carousels **[EXISTS]**
- Hero photo set and the Alley gallery (eight items, each with genre label, title, one-line description and a link to a page).
- Requirement from the audit: **no auto-advancing** content that cannot be paused; manual arrows, dots with accessible names, swipe on touch, visible focus; images carry meaningful alt text. Whether a gallery is a carousel at all is open to the design (a static photo series is acceptable).
- A media library with audio/video is **[CONTRACT, NOT BUILT]**.

### 6.7 Forms
- Editor login/registration and the CMS editor forms work **[EXISTS]**.
- The Muragerler application does **not** reach a server **[OPEN DECISION, OD-9]** (see P09).
- Any form: visible labels (not placeholder-only), inline error messages, 16 px minimum input type, no native `alert()`.

### 6.8 Tooltips on names
Historical names in some home texts reveal a small card on hover/focus with a short biography. Facts in these cards are hard-coded and unreviewed. Whatever the design does with this pattern must work on touch and must not hide essential information.

---

## 7. Navigation and user flows

### Flow A — QR visitor at a stele (phone)
1. Scans a code at a stele; a hash link opens the right language.
2. Lands on a person page **[CONTRACT, NOT BUILT]** (today the nearest is the Alley page P07 or a canon page P03 with the modal).
3. Reads name, years, region, a short biography; (planned) plays a küi.
4. Moves to "the school/region" or "other steles"; or opens the Alley page; or switches language.
Dead ends today: no per-person URL, no audio. Design the planned landing page and a graceful fallback to the Alley page.

### Flow B — First-time visitor exploring the canon
Home → hero «Тұлғалар бөлімі» or the Dina block → «Тұлғалар» (P02) → «101 Күйші каноны» (P03) → filter by school or search → open a person (P04) → back to the list or to the region on the map. Today the filter results are limited to 23 records in total; the empty and "in preparation" states matter.

### Flow C — Researcher looking for a book
Home call-to-action or nav «Цифрлық кітапхана» → library shelf (P02) → volume page (P06) → chapters list → (planned) open or download the PDF **[CONTRACT, NOT BUILT]**. Alternative: search (P13) → page result. Today, text search does not reach chapter titles.

### Flow D — Editor publishes an edit through moderation
Login (P15) → «Беттер» (P17) → «Өңдеу» → change block fields, optionally preview → fill «Енгізілген өзгерістер сипаттамасы» → «Қарауға жіберу» → notice "sent for review"; the public page remains unchanged; the page shows «Жарияланған · өзгерістер қаралуда». Later: status becomes published, or «Қабылданбады» with the reason in the journal.

### Flow E — Super Admin approves
Master key login (P15) → «Әкімшілер» shows pending editor accounts → approve → «Беттер» filter «Қаралуда» → review the changes → «Бекіту» or «Қабылдамау» (reason) — or select several and «Таңдалғандарды бірге бекіту» → «Журнал» to verify.

### Flow F — International visitor
Opens `#/en/...` → switches language from the header → meets Kazakh-only text → sees the "not translated" notice → can still read the page or open the glossary.

### Flow G — Lost visitor
Unknown address → 404 → home or section links → search.

---

## 8. Responsive requirements

| Item | Requirement |
|---|---|
| Breakpoints | **480 / 768 / 1024** (mobile ≤ 480, tablet ≤ 768, desktop ≥ 1024). The current site uses 11 different breakpoints; the design should use this set only. |
| Test widths | 320, 375, 768, 1280 px, both themes, three languages. |
| Layout | Phone: single column, one dominant element per screen. Tablet: at most two columns. Desktop: content column about 1040 px inside a maximum shell width of about 1280 px, reading measure 55–75 characters. |
| No horizontal scroll | At any width, in any language (contract). The header must fit Kazakh labels at every width (the current one fails between 961 and about 1280 px). |
| Long strings | Kazakh and Russian are longer than English by up to 30–40 %. Samples to test: nav label «Цифрлық кітапхана»; page title «Қор басшылығы мен ғылыми кеңес»; «Дина Нұрпейісованың 160 жылдық монументі»; Russian «Руководство и научный совет», «Молодежный клуб «Мұрагерлер»»; kicker «ЖАСТАР БАСТАМАСЫ · МӘДЕНИ САБАҚТАСТЫҚ»; filter label «Қаратау & Сыр бойы»; the three-line description «Қазақтың төкпе және шертпе дәстүрлерін насихаттаған 101 дәулескер күйшінің өмірбаяны мен басты туындылары қашалған мәрмәр-гранит стелалар кешені.» |
| Names | Person names are **never broken mid-word** and never wrap one letter per line. Test «Қуанышев Төлеген Шағытбайұлы», «Қазанғап Тілепбергенұлы», «Ғарифолла Құрманғалиев», «Бұқар жырау Қалқаманұлы» at 320 px. Names may wrap between words only. Size names with a fluid scale so the longest fits at 320 px. |
| Touch targets | At least 44 × 44 px with spacing; this includes language buttons, map markers or their list alternative, close buttons, filter chips and gallery arrows. |
| Type sizes | Body ≥ 16 px mobile, ≥ 18 px desktop is the client target for older readers; no content text below 14 px; labels in caps ≥ 12 px. |
| Images | Lightweight for phones; defined aspect ratios; alt text; no text baked into images. |
| Dialogs | Full-screen sheets on phones. |
| Admin | Functional at 768 px and up; the block builder is not a phone task; login and the review list should still work on a phone. |
| Rail | The ornament rail is about 64 px wide on desktop and about 28 px on mobile and never overlaps content. |
| Print / zoom | Layout survives 200 % browser zoom without loss of content. |

---

## 9. Global states and patterns

| State | Where it appears | Requirement |
|---|---|---|
| **Loading** | App start; the admin lists | Brand screen with «Жүктелуде…»; skeletons for lists; no layout jump when images load (reserve aspect ratio). |
| **Empty** | Section with no blocks; filter with no result; search with no result; map region without data; audit log; editor list | A specific, polite message plus the next action. Examples in use: «Нәтиже табылмады.», «Бұл санат бойынша ешқандай тұлға табылмады.», «Бет әлі бос», «Тіркелген редакторлар жоқ». |
| **Error** | API failure in admin; form submit; missing image | Plain language, retry action, never a raw error code for readers. Admin messages arrive from the server in Kazakh. |
| **Success** | Saved/sent for review/published/approved; copy link done | Inline notice with a check, persistent until dismissed or the route changes; wording distinguishes "published" from "sent for review". |
| **Offline / API down (public)** | Production today | The public site runs on **bundled default content** when the API is missing or fails. Design must not show an error page in this case; the site looks normal. A subtle notice is optional **[OPEN DECISION]**. |
| **API down (admin)** | `#admin` | Buttons disabled and the notice «Сервер (API) қосылмаған. Әкімші панелі тек сервермен жұмыс істейді.»; no fake login. |
| **Not translated** | Any RU/EN view of a Kazakh-only text | Visible notice and a Kazakh label on the text; links to other languages if available **[CONTRACT, NOT BUILT]** for real translation versions. |
| **Not found** | Unknown slug | P14. |
| **Unpublished** | Admin only | Badges; never rendered to readers. |
| **Session expired** | Admin | Return to the login view with a short message (sessions last 12 hours). |
| **Missing image / media** | Cards, banners, persons | Text-first layout, no stock placeholder image. |
| **Very long text** | Titles, names, bodies | Wrap without breaking names; line clamp only with an explicit "read more" and never on essential facts. |

---

## 10. Technical constraints the design must respect

| Constraint | Detail |
|---|---|
| Platform | React single-page application (Vite), plain JavaScript, hash router; no TypeScript. The design must map to components and CSS variables, not to a CSS framework. |
| Dependencies | **No new npm dependencies** may be introduced. Existing: React, icon packs, a QR library, a smooth-scroll library (its use is open). Use existing icon sets sparingly. Illustrations should be SVG or static images. |
| Fonts | **Local files only**; no CDN or external font service. One main typeface. Must cover Kazakh Cyrillic. |
| Router | `#/<lang>/<slug>`; one-segment slugs; deep links must work; no server-side rendering. |
| CMS | Single-column stack of the 10 block types; plain-text body; no columns, tabs, rich text or media fields. A design that needs more is a request for new blocks, not a free layout. |
| Media | **No media storage today.** Images are static files shipped with the site or an external URL typed by the editor. No audio, no video, no PDF. Planned: Cloudflare R2 and YouTube embeds. |
| Bundle | The public part should stay light for phones; an earlier plan targets under 300 KB of JavaScript for the public site (a target, not a measurement) and lazy-loading the admin. Photos should be sized and compressed for mobile. |
| Performance | Avoid blur/backdrop effects and large decorative layers on mobile. |
| Glyphs | Every text style must render Kazakh letters in both cases: **Ә ә, Ғ ғ, Қ қ, Ң ң, Ө ө, Ұ ұ, Ү ү, Һ һ, І і**, plus Russian Cyrillic and Latin for English. Uppercase must be checked before using all-caps. The Һ letter has not been verified in any display face yet. |
| Accessibility | WCAG 2.1 AA target: contrast 4.5:1 body and 3:1 large text/UI, keyboard access, visible focus, dialogs with Esc and focus trap, reduced-motion support, `lang` per language, meaningful alt text. |
| Data limits | Title ≤ 120 characters, description ≤ 1000, up to 100 blocks per page, body ≤ 12 000 characters, up to 100 items per block. |
| Public data | Readers receive only published pages. |
| Hosting (context) | Currently static hosting without the API; target is one VPS (Nginx + Node + PostgreSQL). Not a design concern except that offline/bundled fallback is the production state until the API is connected. |
| Security | Links in content must be `http(s)` or site-relative; no scripts or embeds from editors. |

---

## 11. Visual requirements and principles

### 11.1 FIXED (client-approved)

**Source of the palette:** the cover of the book «Ұлы дала әуені — 110 дәстүрлі әнші» (deep forest green, antique gold, warm parchment). It is a reference only and must not be stretched as a page background. The colours express Turkic and Kazakh culture.

| Role | Token | Value | Use |
|---|---|---|---|
| Deepest green | `--forest-deep` | `#0B1C15` | dark backgrounds, header in dark areas |
| Primary green | `--forest` | `#10291F` | brand green, ornament rail |
| Raised green | `--forest-light` | `#1D4030` | green surfaces |
| Antique gold | `--gold` | `#D7B45F` | accent |
| Gold light | `--gold-light` | `#F0D78C` in code; the contract table says `#E8D59C` — **[OPEN DECISION, OD-8]** | highlight |
| Gold dark | `--gold-dark` | `#A9853C` | lines, badges, gold text on light backgrounds |
| Parchment | `--parchment` | `#F2EBDD` | light canvas |
| Paper | `--paper` | `#E8DFC9` | surfaces |
| Ink | `--ink` | `#26372D` | main text on light |
| Muted ink | `--ink-muted` | `#536458` in code; contract table says `#687568` — which fails contrast on parchment (about 4.1:1) — **[OPEN DECISION, OD-8]** | secondary text |

Semantic roles used in components: `--bg-canvas`, `--bg-surface`, `--text-primary`, `--text-muted`, `--accent-gold` (= gold-dark in light, gold in dark), `--line`.

Rules that come with the palette:
- **Never use light/bright gold as text on a light background.** The pair `--gold-dark` on parchment is about 2.9:1, so it must not carry body-size text or small labels; use ink or reserve gold for rules, marks and large display text that passes 3:1 (or darken after approval).
- Two themes (light and dark «Түнгі дала»); each colour role is defined for both.
- Wine, terracotta and plum from the old system are **not** part of the palette.
- No purple/blue accents.

**One main typeface (client requirement):** the most distinctive element of the brand, clean, readable in long articles, full Kazakh support (Ә Ғ Қ Ң Ө Ұ Ү Һ І), no licensing problem. **Proposed: Literata** (variable, open licence; specimen exists) — **not yet approved by the client [OPEN DECISION, OD-1]**. Until approval the design may use a placeholder stack but must be designed around **one family** with weights/optical sizes; additional display or script families are not assumed. The logo is an image, not a font.

**Logo:** the final vector emblem (dombra, rays, ram's-horn scrolls, double ring) with wordmark «Күй анасы». Client approval of this final version is unknown **[OPEN DECISION, OD-12]**. The logo prototypes with neon glow are not used.

**Other fixed items from the contract:** parchment texture, dombra silhouette and national ornament elements are required visual elements; a fixed left ornament rail (64 px desktop, about 28 px mobile) is required; body text ≥ 18 px on desktop with line height about 1.6; no horizontal scroll; gentle motion that respects reduced motion; no AI-looking imagery (no plastic people, glowing neon renders, synthetic stock scenes); every visual element has a reason.

### 11.2 OPEN (to be decided later from separate concept explorations)

This brief is **direction-neutral**. The following are open and must not be treated as decided by this document:

- Overall visual direction and composition of each page (editorial, catalogue, archive, programme…).
- Type scale, weights, and how a single typeface expresses hierarchy and personality.
- Surface treatment (flat, paper-like, textured), the amount and use of ornament, how the contour graphics of instruments (dombra, kobyz, tors) are used.
- Component shapes (radii, borders, buttons), iconography style, imagery crops and treatments.
- How the two themes differ beyond colour; the dark-theme gradient (OD-6).
- Motion language (anything beyond a calm map zoom).
- Header composition for long Kazakh labels (OD-4).

---

## 12. Preserve from the current implementation, with reasons

| Item | Reason |
|---|---|
| **Dina Nurpeisova feature block** on home (large photograph beside a deep-green panel, display name, short text, link) | It already carries the client's palette and an editorial, museum-like feel; it is a contract block. |
| **Real photography** of the arch, steles, monument, book covers; the alley/monument page logic "banner → parts → catalogue" | Client wants documentary imagery; photography is the strongest asset. |
| **Interactive map** (outline, keyboard-operable markers, live region, honest empty regions, slow zoom) | Contract feature, accessible, and it already says "being compiled" where data is missing. |
| **Hash router** with language prefix, 404 and document title/language | Works; makes shared links and QR codes open in the right language. |
| **Mobile full-screen menu** (large rows, short descriptions, utilities at the bottom) | Thumb-friendly and clear; minus the meaningless numbering. |
| **Dark theme concept «Түнгі дала»** (deep green, gold) | Matches the contract; works well on home at phone and tablet widths. |
| **Volume metadata card** (cover + facts + chapters) | Catalogue-like reading. |
| **Block-based CMS model** and the admin's honest «rendered from code» notice | Correct architecture for staff-edited content; honest about gaps. |
| **Server-side two-tier moderation, bulk approve and audit log** | Contract features that work; the UI should only be made clearer. |
| **Left ornament rail** | Client-required brand element. |
| **Single visible focus ring and reduced-motion branch** | Good accessibility base. |

---

## 13. Reconsider or redesign, with reasons (links to the audit)

P0–P3 numbers refer to the Frontend Audit's ranked problem table.

| Item | Why | Audit |
|---|---|---|
| Header composition in Kazakh at 961–1280 px | Search, language, theme and login are clipped; at 1024 px all four are missing. | P0 #1 |
| Person cards on narrow screens | Names break letter by letter at 375 px. | P0 #2 |
| Person imagery | Stele photos, book covers and alley photos stand in for portraits; leader bands sit on book covers. | P0 #3 |
| Unverified numbers and promised features | Statistics, ISBNs, bus routes, "QR audio guide", "personal QR code", the sample "reader", the form's fake success. | P0 #4 |
| Auto-advancing carousels | Two timers without pause controls; harmful for older readers. | P1 #5 |
| Accent text contrast | Gold-dark text on parchment is about 2.9:1 (nav, kickers, secondary actions, figures band). | P1 #6 |
| Dark theme | Banner text unreadable, wine-tinted surfaces, flat background, many per-component overrides. | P1 #7 |
| Typography system | Nine families, script fonts for functional labels, many small sizes and heading scales. Replaced by one family and a short scale. | P1 #8 |
| Navigation semantics | Navigation made of buttons instead of links; clickable cards that cannot be focused; two modals without dialog behaviour. | P1 #9 |
| Content edit gap | 11 pages are drawn from code; staff cannot edit them. | P1 #10 |
| Language gaps | Footer and content stay Kazakh in RU/EN; Cyrillic leftovers in English text; admin Kazakh only. | P1 #11 |
| Frosted shell, pills, icon orbs, equal card rows | Against the direction; leaders and Muragerler rows are generic equal cards. | P2 #12 |
| Home duplication and details | Leaders appear twice; doubled quotation marks «««…»»»; internal «7 модуль» label; call-to-action to the library on the library page. | P2 #13 |
| Smooth-scroll library | Adds input lag, no benefit for the audience. | P2 #14 |
| Footer | No contact, no «Қор туралы» link, public admin pitch. | P2 #15 |
| Alley page order | Practical information for QR visitors comes last. | P2 #17 |
| Illustration with «АТРИБУЦИЯ ЖОҚ» | Unknown provenance; can read as AI-generated. | P2 #18 |
| Search promise | Placeholder promises people and küis but searches CMS pages only. | (new, see P13) |
| Typed counts in titles («101 / 110 / 110») | Data holds 9, 7 and 7 records. | (new, see P03) |

---

## 14. Prohibited patterns

Do not produce any of the following.

| Pattern | Why it is banned here |
|---|---|
| Equal-size card grids as the default layout; numbered rows (01/02/03) without meaning | Generic template look; client forbids "AI slop". |
| A centred hero over three identical feature cards | Same. |
| Purple/blue/neon gradients; decorative gradients beyond subtle photo shading and the dark-theme background gradient (OD-6) | Off-palette and generic. |
| Glassmorphism / frosted blur panels; heavy shadows | Client rule (no glassmorphism, no heavy shadows). |
| Pill-shaped everything; large radii on every element | Generic SaaS. |
| Emoji as icons or decoration; random decorative icons; icons in coloured circles as filler | Client rule. |
| All-caps mono labels above every heading | Visual noise; hurts legibility for older readers. |
| Script or thin decorative fonts for functional labels (filters, buttons, stats) | Illegible for the audience. |
| Stock photography or AI-generated imagery (plastic people, glowing renders) | Client rule. |
| Fake functionality: play buttons without audio, download buttons without files, forms with fake success, "online reader" of non-existent books, QR/audio guides that do not exist, search promising things it cannot find | Project rule: every button, form and player must work or not ship. |
| Invented content: unconfirmed numbers, ISBNs, names, dates, quotes, mentors, timetables, bus routes | Project rule; use "placeholder — content pending client confirmation". |
| Auto-rotating carousels without a visible pause | Accessibility. |
| Hover-only information | Touch users and older readers. |
| Text below 14 px for content; low-contrast gold text on parchment | Accessibility. |
| Static ornament frames around pages, faux parchment textures, random ornament packs | Ornament is only the rail and meaningful, low-contrast instrument contours. |
| Copying another institution's look or assets | Brief rule: references inform, not copy. |

---

## 15. Glossary

One-line meanings that are well established; no historical claims.

| Term (kk) | Meaning |
|---|---|
| **Күй** (küi, kui) | A traditional Kazakh instrumental piece, usually for dombra or kobyz, often with a story or image behind it. |
| **Күйші** (küishi, kuyshi) | A performer and/or composer of küi. |
| **Күйші-композитор** | A küishi who composes küis. |
| **Жырау** (zhyrau) | A traditional poet-singer of the Kazakh steppe who performs epic or declamatory verse, historically often with a kobyz or dombra. |
| **Жыршы** (zhyrshy) | A performer of epic songs (жыр, zhyr). |
| **Жыр** (zhyr) | A Kazakh epic or narrative song or verse. |
| **Әнші** (anshi) | A singer, here a performer of traditional Kazakh song. |
| **Ән** (an) | Song. |
| **Домбыра** (dombra) | A two-stringed plucked Kazakh instrument. |
| **Қобыз** (kobyz) | A bowed string instrument of the Kazakh tradition. |
| **Төкпе күй** (tökpe küi) | A küi playing style/tradition associated, in the site's own categories, with the western school. |
| **Шертпе күй** (shertpe küi) | A küi playing style/tradition associated, in the site's categories, with the Arka (central) school. |
| **Стела** (stele) | A standing stone slab; here the memorial slabs at the Alley bearing names of küishis and of zhyraus. |
| **Алея** / **Күйшілер аллеясы** | The Alley of Küishis, a public memorial space in Astana created by the foundation. |
| **Монумент** | The bronze monument «Күй анасы — Дина» in Astana. |
| **Күй анасы** | "Mother of küi", the epithet used for Dina Nurpeisova in the monument's name and the foundation's name. |
| **Мұрагерлер** (muragerler) | "Heirs/successors"; the name of the foundation's youth club. |
| **Қор** | Foundation. |
| **Тұлға** (tulga) | An outstanding person; a notable figure (the section «Тұлғалар»). |
| **Канон** | Here: the planned complete list of notable figures of each tradition (101 küishis, 110 zhyraus and zhyrshys, 110 singers) as named by the foundation. |
| **Мектеп** (school) | A regional or stylistic performing tradition (for example «Арқа ән мектебі»). |
| **Мұқаба** | Book cover. |
| **Том** | Volume of a book. |
| **Түнгі дала** | "Night steppe", the name of the dark theme. |
| **Басты бет** | Home page. |
| **Бас әкімші** | Super Admin. |
| **Редактор** | CMS editor. |
| **Журнал** | The audit log (in the admin). |
| **Модуль** | Internal CMS word for a block; not shown to readers. |

---

## 16. Open questions

### 16.1 [OPEN DECISION] register

| ID | Decision needed | Options (not chosen here) | Owner |
|---|---|---|---|
| OD-1 | Main typeface | Literata (proposed) / another family with full Kazakh coverage; check Һ/һ | Client |
| OD-2 | Portraits of people | (a) no image, text-only cards; (b) monograms; (c) real archival portraits with credits supplied by the client | Client |
| OD-3 | Unconfirmed statistics and facts (figures band, club figures, ISBNs, page counts, bus routes, stele numbers, schedule, mentors) | Keep after confirmation / hide until confirmed / replace by neutral placeholder. **Also** data for the four empty map regions (OD-3b) | Client |
| OD-4 | Header and utilities for long Kazakh labels (between about 961 and 1280 px) | Shorter labels / move search into the menu / switch to the menu earlier / two-row header. Sub-decision OD-4b: where the editor login entry lives | Owner |
| OD-5 | Contact entry (none exists; contract says exactly six main sections) | Footer contact block / a page under «Қор туралы» / none | Owner + client |
| OD-6 | Dark-theme background gradient stops | Owner/client to give stops; earlier proposal exists | Client |
| OD-7 | Dombra-player illustration: source and attribution | Supplied by client / commissioned / removed | Client |
| OD-8 | Palette values that differ between the contract table and the code (gold light `#E8D59C` vs `#F0D78C`; muted ink `#687568` vs `#536458`) | Use the code values (muted ink passes contrast) / the contract values (fails) | Owner |
| OD-9 | Muragerler application form | Real submission (endpoint and admin inbox) / remove | Owner + client |
| OD-10 | Who supplies RU/EN translations of articles, and when | — | Client |
| OD-11 | Rich text in CMS body (paragraphs, bold, links) | Add / keep plain text with more blocks | Owner + client |
| OD-12 | Final logo approval | — | Client |
| OD-13 | Search scope | CMS pages only (today) / include people, works and books once in the data store / reword the placeholder | Owner |
| OD-14 | The sample "online reader" on volume pages | Remove / replace with a real PDF viewer or download when files exist | Owner |
| OD-15 | Whether the public payload may show author/approver names | Show / hide | Owner |
| OD-16 | How to display canon sizes (titles say 101/110/110, data holds 9/7/7) | Show true count / hide numbers / "in preparation" | Owner + client |
| OD-17 | Planned person pages and block set (person, audio, video, gallery, FAQ, schedule) | Confirm which planned blocks to design now | Owner |

### 16.2 Further questions

1. Which pieces of text on the Alley and monument pages may be shown as written, given that parts were written for the site and have no source line?
2. Will audio files exist before 16.11.2026? If not, how prominent should the planned audio states be?
3. Is there a requirement for a "sources/credits" line on every person and photograph?
4. Are the three languages required on every page at launch or may Kazakh-only pages carry a notice?
5. Is any content for the "media library" on the home page available?
6. What is the foundation's official name in Russian and English for the footer and metadata (current strings: «© 2026 «КҮЙ АНАСЫ» жеке қоры», «© 2026 Частный фонд «КҮЙ АНАСЫ»», «© 2026 "KUI ANASY" Private Foundation»)?

---

## Architect alignment review (05.11.2026)

Reviewer: architect. Method: every [EXISTS] / [CONTRACT, NOT BUILT] / [OPEN DECISION] tag and every admin and API statement checked against `server/src/index.js`, `server/src/auth.js`, `client/src/**` and `FINAL.md` section 2. Only the brief was edited.

### Canon record counts (settled)
`client/src/constants/kuishiData.js`: **küyshi 9** (master `id:` entries at lines 19, 30, 41, 52, 63, 74, 85, 96, 107), **zhyrau 7** (lines 160-226), **anshi 7** (lines 253-319). Total 23. The `masters: []` at lines 130 and 143 are the empty ru/en küyshi lists; `zhyrau` and `anshi` have only a `kk` key (sections start at lines 146 and 239). The brief's "9 / 7 / 7" was already correct. `FRONTEND_AUDIT.md` line 281 ("9 küishi, 9 zhyrau, 5 anshi") is wrong in its split (the total of 23 is right) and needs correcting to 9 / 7 / 7.

### Corrections made
| # | Where | Was | Now | Evidence |
|---|---|---|---|---|
| 1 | P13 States | "logged-in editors also see unpublished pages" in search | Unpublished pages are not searchable: the browser only ever loads the public published list, even after admin refresh. Also noted that code-rendered pages are found via their CMS placeholder text, which differs from what the page shows | `client/src/admin/AdminPanel.jsx:73` (`onPagesChange(await getPages())`), `server/src/index.js:189-198`, `client/src/App.jsx:132-139` |
| 2 | P16 | No statement of who can register | Open to anyone, no invitation, no rate limit on register (login is limited to 10 failures per 15 min); real success message quoted; 409/400 | `index.js:227-242`, `auth.js:98-120`, `client/src/admin/AuthView.jsx:57` |
| 3 | P17 | Not stated | Any approved editor sees and edits every page (no ownership) | `index.js:337,370` (`requireAuth` only) |
| 4 | P19 / Flow D | Reject "with a reason" implied the editor can see it | The reason lives only in the audit log; a rejected draft of a published page is discarded, a rejected never-published page becomes «Қабылданбады» and returns to pending on re-save; one draft slot per page; one shared Super Admin identity | `index.js:395-418,467-487`, `AdminPanel.jsx:191` |
| 5 | P20 | Row shows "details (before/after)" | UI shows only a one-line change summary (title, description, section, module count before → after); full before/after is stored but not displayed. Added logins to the recorded actions | `client/src/admin/AuditLogView.jsx:23-31,106`, `index.js:220,260,419-422` |
| 6 | P21 | "no reject, only delete" | Plus: delete is a native confirm, works on approved editors, ends their sessions (FK cascade); no suspend, no password change/reset | `AdminPanel.jsx:223`, `index.js:312-322`, `index.js:566` |
| 7 | §6.4 QR | "Only http(s) links are accepted. Links to pages use the hash form `#/<lang>/<slug>`" (implies a relative hash link is a valid QR target) | A `qr` block requires an **absolute** http(s) URL; a QR to a site page needs the full address with the domain (not yet chosen); the planned per-article button must build it | `index.js:81-91`, `FINAL.md:96` |
| 8 | P15 | Two tabs described without semantics | Master key is shared by every holder and stored only server-side | `index.js:210-225`, `auth.js:62-66` |

### Checked and found accurate (no change)
- All [EXISTS] tags on P01-P14 hold: sitemap and 17 slugs, 11 pages code-rendered plus home hybrid (`App.jsx:193-220`, `AdminPanel.jsx:29-33`), block types and the "link not rendered / card image not editable / cards not links" facts (`ContentBlock.jsx`), search shortcuts `/` and Ctrl+K (`Header.jsx:49`), search shortcut pills (`Header.jsx:348-355`), 404, Muragerler form stored in `localStorage` only (`MuragerlerPage.jsx:422-445`), library "download" is the cover image only (`LibraryVolumePage.jsx:144-150`), heritage with no audio, map with nine regions.
- All [CONTRACT, NOT BUILT] items are correctly labelled and none is drawn as existing: per-person pages, QR button on every article, free-link QR input, PNG download, audio, video, media upload, PDF, trilingual content, language tabs, real application form. Items with no contract basis (page delete, page reorder, password reset, suspend/reject account) are correctly marked "not in contract".
- Admin P15-P21 match the real flow: register (open) → pending → Super Admin approves or deletes → editor edits (published page becomes a hidden draft, new page becomes pending) → Super Admin approves (single or bulk, one transaction) or rejects → published → audit log (Super Admin only). 12 h sessions. Editors cannot approve, reject, delete accounts or read the audit log.
- Invented endpoints or fields: none found in the brief.

### Remaining risks
1. The audit's canon split (9/9/5) must be corrected; otherwise designers may see conflicting numbers.
2. Seed and code content disagree: the CMS placeholders of the 11 code-rendered pages differ from what is shown, so a future migration must decide which text is authoritative.
3. The planned blocks in §5.2 and the person page (P05) rest on the architecture plan only; the brief marks them planned, but the owner has not confirmed OD-17.
4. Content on Muragerler, Alley and Library pages (mentors, schedule, figures, ISBNs, bus routes, "QR audio tour" claim at `AlleyPage.jsx:220`) is unconfirmed; the brief correctly withholds it. A leftover claim of a "QR audio tour" in the Alley visitor guide should be treated as a defect.
5. `GET /api/pages` returns `created_by` and `approved_by` (OD-15 covers it).
6. The API is not connected in production, so admin-edited content cannot appear on the live site until it is.
7. The Alley page's stele catalogue (19 kk names) and `CANON_DATA` (9 küyshi) hold different people lists; the "which list is canonical" question affects the Alley and canon designs.

### Verdict
**Aligned with caveats.** The brief describes the real system faithfully after the eight corrections above. The caveats are risks 1-7: the audit count to fix, unconfirmed content, planned-but-unconfirmed blocks, and the unconnected production API.
