# Backend capabilities: what the system actually supports

Date: 2026-11-05. Branch `chore/ai-dev-system`. Audience: the frontend design brief for an external design tool (Google Stitch).
Scope: reconnaissance only. No backend redesign. `.env` was not read; only `.env.example`.

Labels: **Verified** = seen in code (path:line). **Inferred** = reasoned from code. **Recommendation** = suggestion, not a fact.
Paths are relative to the repo root. `server/src/index.js` is written `index.js`, `server/src/auth.js` is `auth.js`.

---

## 1. Summary

- **Verified.** The API is small: 1 public read endpoint (`GET /api/pages`), 1 health check, 4 auth endpoints, and 8 admin endpoints (`index.js:178-505`). There is no endpoint for people, media, search, forms, translations or QR.
- **Verified.** A "page" is one row in `content_pages`: `slug`, `title`, `description`, `parent_slug`, `position`, and an ordered JSONB array of **blocks** (`index.js:518-533`). There is no `lang` column.
- **Verified.** Exactly **10 block types** are accepted by the server: `heading, text, feature, quote, image, list, stats, cards, callout, qr` (`index.js:69`). Items inside `list`, `stats` and `cards` are free-form objects.
- **Verified.** Only 17 pages are seeded, in 6 top-level sections plus sub-pages. **11 of the 17 are rendered by hard-coded JSX**, not from CMS blocks, and `home` is a hybrid (`client/src/App.jsx:198-220`, `client/src/admin/AdminPanel.jsx:29-33`). Edits to those pages in the admin do not change what visitors see.
- **Verified.** All content people, books, regions, schedules and the gallery live **only in frontend files** (`client/src/constants/*.js`, `client/src/pages/*.jsx`). The backend cannot serve them.
- **Verified.** No per-person URL exists. A person is a modal on a canon page. The map hands focus over through `sessionStorage` (`client/src/pages/CanonPage.jsx:36-52`).
- **Verified.** No upload, no audio, no video, no file storage, no PDF. Images are plain URLs or paths to files in `client/public/images`. Cloudflare R2 and YouTube are planned in contract documents but absent in code.
- **Verified.** Languages: the UI is translated into kk/ru/en. **Article content is Kazakh only** (no trilingual content model). Some hard-coded pages have ru/en text; others do not.
- **Verified.** The Muragerler application form never reaches a server. It writes to the visitor's `localStorage` (`client/src/pages/MuragerlerPage.jsx:422-445`). Search is client-side only (`client/src/App.jsx:132-139`).
- **Verified.** Two-tier admin with server-side sessions, editor registration and approval, draft moderation, bulk approve and an audit log are implemented and work. Production has **no API connected** today: `VITE_API_URL` is unset, so the live site serves bundled seed pages (`FINAL.md:199`).

---

## 2. System overview

### 2.1 Diagram

```
 Visitor browser                         Editor / Super Admin browser
 React SPA (Vite, hash router)           same SPA, route  #admin
        |                                         |
        | GET /api/pages  (published only)        | Bearer session token / X-Admin-Token
        v                                         v
 +------------------------ Express API (server/src/index.js) ---------------------+
 |  zod validation | CORS allow-list | in-memory login limiter | 1 MB JSON limit   |
 +-----------------------------------+---------------------------------------------+
                                     |
                              PostgreSQL (pg)
          content_pages | admin_users | admin_sessions | audit_log
 If the API fails or VITE_API_URL is empty: SPA falls back to bundled client/src/defaultPages.js
```

### 2.2 Hosting and environment

| Item | Fact | Source |
|---|---|---|
| Frontend now | Vercel project `kui-anasy`, builds the client only, SPA rewrite to `/index.html` | `vercel.json:1-12`, `client/vercel.json:1-5`, `FINAL.md:198` |
| API in production | **Not connected** (`VITE_API_URL` unset). Public site shows bundled pages. Admin panel shows "server not connected" | `FINAL.md:199`, `client/src/api.js:10-14,52` |
| Target hosting (contract) | One VPS: Nginx + Node + PostgreSQL; Cloudflare R2 for files; YouTube for video. **Not set up** | `FINAL.md:93-96,201` |
| `INFRASTRUCTURE.md` | Plans Hoster.kz VPS (2 GB), Cloudflare R2 for audio and PDF, YouTube for video. Planning document only. Conflicts with the contract on VPS size; the contract wins | `INFRASTRUCTURE.md:7-36`, `FINAL.md:99` |
| Env variables (names) | `DATABASE_URL`, `ADMIN_TOKEN` (min 24 chars, required), `CLIENT_ORIGIN` (CORS list), `DATABASE_SSL`, `VITE_API_URL`, optional `PORT`, `VERCEL` | `.env.example:1-9`, `index.js:23-47` |
| Serverless | `index.js` exports the app for Vercel and caps the pool at 3, but no `api/` entry exists and the server project is "ignored" by decision | `index.js:44-45,597-605`, `FINAL.md:200` |
| Migrations | No migration files. Tables are created with `CREATE TABLE IF NOT EXISTS` at first request after process start | `index.js:133-141,516-595` |

---

## 3. Data model

PostgreSQL, 4 tables, no other storage. Source: `index.js:516-595`.

### 3.1 `content_pages` (`index.js:518-548`)

| Column | Type | Notes |
|---|---|---|
| `slug` | text **PRIMARY KEY** | URL identifier. Accepted by API: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 1-80 chars (`index.js:96`) |
| `title` | text NOT NULL | 1-120 chars, trimmed (`index.js:97`) |
| `description` | text, default `''` | max 1000 chars (`index.js:98`) |
| `position` | integer, default 0 | 0-1000. Sort order (`index.js:99`, `192`) |
| `parent_slug` | text, default `''` | Free text. **No foreign key, no check that the parent exists** (`index.js:100`) |
| `status` | text, default `'published'` | Values used in code: `published`, `pending`, `rejected`. No CHECK constraint |
| `created_by`, `approved_by` | text | Display names, not user ids |
| `approved_at` | **text** (not timestamp) | `index.js:527` |
| `change_summary` | text | editor's note, max 1000 |
| `blocks` | jsonb NOT NULL, default `[]` | Ordered array of block objects, max 100 (`index.js:102`) |
| `is_custom` | boolean, default false | `true` for pages created through `POST /api/pages`; seed pages `false` (`index.js:344`) |
| `updated_at` | timestamptz | |
| `pending_draft` | jsonb, nullable | Editor's proposed edit of a published page (title, description, position, parent_slug, change_summary, blocks) |
| `pending_by` | text | draft author name |
| `pending_at` | timestamptz | |

### 3.2 `admin_users` (`index.js:550-561`)
`id uuid PK`, `full_name`, `username text UNIQUE`, `password_hash` (scrypt), `status` default `'pending'` (`pending` or `approved`), `created_at`, `approved_at`, `approved_by` (name text).

### 3.3 `admin_sessions` (`index.js:562-571`)
`token_hash text PK` (SHA-256 of the token), `role` (`SUPER_ADMIN` or `EDITOR`), `user_id uuid` **FK to `admin_users(id)` ON DELETE CASCADE**, `full_name`, `expires_at`, `created_at`. Expired rows are purged at startup and hourly (`index.js:585,599-601`).

### 3.4 `audit_log` (`index.js:572-584`)
`id bigserial PK`, `at timestamptz`, `actor text`, `role text`, `action text`, `target text` (a slug or username), `summary text`, `details jsonb`. Index on `target`.

### 3.5 What does NOT exist
**Verified.** No tables for: people/persons, regions, books, media/files, translations, form submissions, categories, tags, comments, users of the public site (no reader accounts, no "Premium").

---

## 4. API reference

Base: same origin or `VITE_API_URL`. All bodies JSON. Error body is always `{ "error": "<Kazakh message>" }`; validation errors also carry `details` (zod issues) (`index.js:144-150`).
Auth: a session token goes in `Authorization: Bearer <token>`. Legacy: header `X-Admin-Token: <master key>` is accepted as Super Admin (`auth.js:54-66`).

### 4.1 Endpoint table

| # | Method + path | Auth | Request | Success response | Error codes | Source |
|---|---|---|---|---|---|---|
| 1 | `GET /api/health` | public | none | `{status:'ok'}` | 503 | `index.js:178-186` |
| 2 | `GET /api/pages` | public | none | array of **published** pages (columns below), ordered by `position, title` | 500 | `index.js:189-198` |
| 3 | `POST /api/auth/master` | public, rate-limited | `{token}` | `{token, expiresAt, user:{role:'SUPER_ADMIN', fullName:'Бас әкімші'}}` | 401 wrong key, 429 | `index.js:210-225` |
| 4 | `POST /api/auth/register` | public (**not** rate-limited) | `{fullName 2-150, username 3-40 [a-z0-9._-], password 8-200}` | 201 `{status:'pending'}` | 400, 409 username taken | `index.js:105-111,227-242` |
| 5 | `POST /api/auth/login` | public, rate-limited | `{username, password}` | `{token, expiresAt, user:{role:'EDITOR', fullName, username, id}}` | 401 (also for malformed input), 403 not yet approved, 429 | `index.js:244-266` |
| 6 | `GET /api/auth/me` | any session | none | `{user:{role, fullName, id}}` | 401 | `index.js:268-270` |
| 7 | `POST /api/auth/logout` | any | none | `{ok:true}` (no-op without session) | 500 | `index.js:272-279` |
| 8 | `GET /api/admin/pages` | editor or super | none | all pages incl. `pending_draft, pending_by, pending_at` | 401 | `index.js:328-335` |
| 9 | `POST /api/pages` | editor or super | page object (4.3) | 201 page row | 400, 401, 409 slug exists | `index.js:337-364` |
| 10 | `PUT /api/pages/:slug` | editor or super | page object, `slug` must equal URL | page row | 400 (incl. slug mismatch), 401, 404 | `index.js:370-430` |
| 11 | `POST /api/admin/pages/approve` | **super** | `{slugs: string[1..200]}` | array of approved rows | 400, 401, 403 | `index.js:432-465` |
| 12 | `POST /api/admin/pages/:slug/reject` | **super** | `{reason?}` (max 1000) | page row | 401, 403, 404 | `index.js:467-487` |
| 13 | `GET /api/admin/audit` | **super** | query `limit` (1-500, default 100), `before` (id cursor), `target` | array of audit rows, newest first | 401, 403 | `index.js:489-505` |
| 14 | `GET /api/admin/editors` | **super** | none | all editor accounts (no hash) | 401, 403 | `index.js:285-294` |
| 15 | `POST /api/admin/editors/:id/approve` | **super** | none | editor row | 404 | `index.js:296-310` |
| 16 | `DELETE /api/admin/editors/:id` | **super** | none | `{ok:true}` | 404 | `index.js:312-322` |

Not present (**Verified by absence**): delete page, reject/deny a registration (only delete the account), change password, per-page fetch (`GET /api/pages/:slug`), search, upload, media list, form submission, translations, export.

### 4.2 Public page object (response of #2)
`slug, title, description, position, parent_slug, status, created_by, approved_by, approved_at, change_summary, blocks, is_custom, updated_at` (`index.js:114-115`). The public payload includes `created_by` and `approved_by` display names (**Inferred** privacy note).

### 4.3 Page write schema (`index.js:95-103`)
`slug`, `title`, `description` (default ''), `position` (int 0-1000, default 0), `parent_slug` (default ''), `change_summary` (default ''), `blocks` (array, max 100). Unknown keys (such as `lang`) are silently stripped. Authorship and status are always set by the server.

### 4.4 Block schema (`index.js:67-91`)
`id` (1-100), `type` (enum of 10), `title` (max 300), `body` (max 12000), optional `eyebrow` (200), `items` (array of max 100 free-form objects), `link` (max 2000), `linkLabel` (200). Links must be site-relative (`/x`, `#x`) or `http(s)`. A `qr` block requires an absolute `http(s)` link.

### 4.5 Limits
- JSON body 1 MB (`index.js:131`).
- Login limiter: 10 failures per IP per 15 min, in memory (`auth.js:98-120`). Resets on restart. Does not cover `register`.
- Session lifetime 12 h (`auth.js:5`).
- CORS: allow-list from `CLIENT_ORIGIN` (`index.js:29-32,125-130`).

---

## 5. CMS content model and block types

**Verified.** Every CMS page is: banner (title, description, breadcrumb) + an ordered list of blocks + an auto-generated list of child pages + a global callout (`client/src/pages/StandardPage.jsx:16-71`). Blocks are stacked vertically in one column. There is no grid, column, tab or section layout control.

### 5.1 Block types

Fields shared by all: `id`, `type`, `title`, `body`. Rendering: `client/src/components/ContentBlock.jsx`. Admin editor: `client/src/admin/AdminPanel.jsx:535-569`, `client/src/admin/adminUtils.js:36-50`, `client/src/admin/ItemsEditor.jsx`.

| Type | Fields the **editor can fill** | Rendering (what a visitor sees) | Used in seed? | Source |
|---|---|---|---|---|
| `heading` | `title`, `body`, `eyebrow` | **Same layout as `text`/`feature`**: small kicker, H2, paragraph. No distinct heading style | no | ContentBlock.jsx:76-88; AdminPanel.jsx:566 |
| `text` | `title`, `body`, `link` | Kicker (if any), H2, paragraph. **`link` is stored but not rendered** | yes (6) | ContentBlock.jsx:76-88 |
| `feature` | `eyebrow`, `title`, `body`, `link` | Same as `text`; every other block is offset left/right (`index % 2`). **`link` not rendered** | yes (19) | ContentBlock.jsx:76-88 |
| `quote` | `title` (= attribution), `body` (= quote text) | Large pull-quote in «», `cite` = title | yes | ContentBlock.jsx:11-18 |
| `image` | `title` (= alt text), `body` (= caption), `link` (= image URL or path) | Figure with caption. Falls back to `/images/kuyshiler-alley.jpg` when empty. **No upload, only a URL/path** | no | ContentBlock.jsx:59-66 |
| `list` | `title`, `body`, `items[].text` | H2, intro, bullet list | yes | ContentBlock.jsx:71-79 |
| `stats` | `items[].value`, `items[].label` (no title/body in editor) | Numbered figures `01, 02…` with big value and label | yes | ContentBlock.jsx:19-31 |
| `cards` | `title`, `body`, `items[].title`, `.meta`, `.description` | Grid of mini-cards, each with an image, meta tag, title, description. **The image is not editable**: it is `card.image` if present (no editor field) otherwise one of 3 book covers by index. Cards are **not clickable** on standard pages | yes | ContentBlock.jsx:32-47; ItemsEditor.jsx:7-9 |
| `callout` | `eyebrow`, `title`, `body`, `link`, `linkLabel` | Highlighted box, optional kicker, one external-style link button (opens a new tab) | yes | ContentBlock.jsx:48-58 |
| `qr` | `title` (caption), `link` (absolute http/https) | QR image generated in the browser, caption, link row with copy button. **No PNG download** | no | QRBlock.jsx; AdminPanel.jsx:545-564 |

### 5.2 Extra fields that exist in seed data but not in the editor
**Verified.** Seed `cards` items on `home` carry a `slug` that the home page uses as navigation target (`client/src/pages/HomePage.jsx:129`). The editor does not expose it, and the generic `cards` renderer ignores it.

### 5.3 What the CMS cannot express today
**Verified by absence.** No block for: audio, video/YouTube, gallery, PDF or download, person/profile, FAQ, schedule/timetable, map, table, form, embed, two-column layout. Rich text does not exist: `body` is plain text rendered in one `<p>` (`ContentBlock.jsx:86`), so paragraphs, bold and links inside text are not supported.

### 5.4 Hierarchy
**Verified.** Hierarchy is only `parent_slug`. The admin UI always sets `parent_slug` to one of 5 sections (`people, heritage, projects, library, about`, default `people`) (`client/src/constants/index.js:385-391`, `AdminPanel.jsx:149`). So the editor can create only **2-level** content and **cannot create a new top-level section**. Navigation shows pages with no `parent_slug`, ordered by the hard-coded `NAV_ORDER` (`App.jsx:122-131`; `constants/index.js:14`).

---

## 6. Page inventory

17 seeded pages. Seed file: `server/src/defaultPages.js` (701 lines). **Verified: `client/src/defaultPages.js` is byte-identical (diff shows no difference)**, so the content is duplicated; the client copy is the offline fallback (`client/src/api.js:1,43-45`). Seed uses `INSERT … ON CONFLICT (slug) DO NOTHING`, so changing the seed file does not update an existing database (`index.js:587-594`).

"Public view" tells which source decides what visitors see (`client/src/App.jsx:193-220`).

| Slug | Title (kk, from seed) | Parent | Seed block types | Public view | Seed lines |
|---|---|---|---|---|---|
| `home` | Ұлы дала әуені | - | quote, stats(4), feature, cards(3) | **Hybrid**: picks first quote/stats/feature/cards from CMS; the rest is JSX | 3 |
| `about` | Қор туралы | - | feature, cards(4), text, quote | CMS | 73 |
| `about-charter` | Қордың құрылымы мен міндеттері | about | feature, list(6) | **JSX** (`CharterPage`) | 128 |
| `about-leadership` | Қор басшылығы мен ғылыми кеңес | about | feature×3 | **JSX** (`LeadershipPage`) | 170 |
| `people` | Тұлғалар | - | feature, cards(3), quote | CMS | 200 |
| `people-kuyshi` | 101 Күйші каноны | people | feature, list(5) | **JSX** (`CanonPage`) | 244 |
| `people-zhyrau` | 110 Жырау мен жыршы каноны | people | feature, list(4) | **JSX** (`CanonPage`) | 283 |
| `people-anshi` | 110 Дәстүрлі әнші каноны | people | feature, list(4) | **JSX** (`CanonPage`) | 319 |
| `heritage` | Музыкалық мұра | - | feature, cards(3), quote | CMS (the only section index that is fully CMS with no sub-pages) | 355 |
| `library` | Цифрлық кітапхана | - | feature, cards(3), callout | CMS | 399 |
| `library-vol-1` | I том · «Күй әлемі» | library | feature, text | **JSX** (`LibraryVolumePage`) | 445 |
| `library-vol-2` | II том · «Ғасырлар үні» | library | feature, text | **JSX** | 467 |
| `library-vol-3` | III том · «Ұлы дала әуені» | library | feature, text | **JSX** | 489 |
| `projects` | Жобалар | - | feature, cards(5), callout | CMS | 511 |
| `projects-alley` | Күйшілер аллеясы | projects | feature, stats(4), text | **JSX** (`AlleyPage`) | 567 |
| `projects-monument` | Дина Нұрпейісованың 160 жылдық монументі | projects | feature, quote, text | **JSX** (`MonumentPage`) | 612 |
| `projects-muragerler` | «Мұрагерлер» жастар үйірмесі | projects | feature, stats(3), list(5), quote, callout | **JSX** (`MuragerlerPage`) | 640 |

Counts: **Verified** by running the seed. Block types never used in the seed: `heading`, `image`, `qr`. Blocks in code-rendered pages are used only for search text and the admin list. Admin list flags them as code-rendered (`AdminPanel.jsx:29-33,402`).

Note. The CMS blocks of a code-rendered page often do **not** match the JSX version (for example `people-kuyshi` seed has 5 list bullets; the JSX shows 9 masters with biographies). **Inferred:** the CMS copies are placeholders.

Note. The 5 section pages (`people`, `heritage`, `library`, `projects`, `about`) plus `home` are what the main navigation shows (6 sections, as the contract requires: `FINAL.md:63`).

---

## 7. Auth, roles and admin workflows

### 7.1 Roles (`auth.js:8,87-96`)

| Role | How obtained | Can do |
|---|---|---|
| Public reader | nothing | read published pages |
| `EDITOR` | registers, then a Super Admin approves | create pages (go to `pending`), edit any page (as draft), see all pages including others' drafts |
| `SUPER_ADMIN` | enters the master key `ADMIN_TOKEN` at `POST /api/auth/master` (stored only in server env, never in DB or client) | everything: publish directly, approve/reject, manage editors, read audit log |

**Verified.** There is no ownership check: any approved editor can edit any page (`PUT /api/pages/:slug` needs only `requireAuth`, `index.js:370`). There is exactly one Super Admin identity ("Бас әкімші") shared by all holders of the key; the audit log cannot tell Super Admin holders apart.

### 7.2 Workflow

1. **Register.** Person submits full name, username, password. Row is created with `status='pending'`. Audit `editor.register` (`index.js:227-242`). Login before approval gives 403 with a "waiting for approval" message (`index.js:255-257`).
2. **Approve account.** Super Admin sees pending accounts (admin tab "Әкімшілер", `AdminPanel.jsx:254-258`) and approves (`index.js:296-310`) or deletes. Audit `editor.approve` / `editor.delete`. There is no "reject with reason" for accounts.
3. **Login.** Session token valid 12 h. The server re-checks that the editor is still approved on every request (`auth.js:78`).
4. **Edit / create.**
   - Super Admin create or edit: published immediately (`index.js:348,386-394`). Audit `page.create.publish` / `page.update.publish`.
   - Editor creates a page: `status='pending'`, hidden from the public (`index.js:348`). Audit `page.create.submit`.
   - Editor edits a **published** page: stored in `pending_draft`; the public still sees the old version (`index.js:404-418`).
   - Editor edits a never-published or rejected page: row is updated in place and returns to `pending` (`index.js:395-403`).
   - Audit `page.update.submit` with `before` and `after` snapshots (`index.js:419-422`).
5. **Moderate.** Super Admin approves one or many (`POST /api/admin/pages/approve`): the draft replaces the live fields, status becomes `published`, all in one transaction; audit `page.approve` per page and `page.bulk_approve` for more than one (`index.js:432-465`). Reject: a published page keeps its live version and the draft is dropped; a pending page becomes `rejected`. Audit `page.reject` with a reason (`index.js:467-487`).
6. **Publish.** The public `GET /api/pages` returns only `status='published'` (`index.js:192`). The client search additionally includes unpublished pages for any logged-in session (`App.jsx:136`).
7. **Audit.** Super Admin only. View in "Журнал" tab (`client/src/admin/AuditLogView.jsx`). Records actor name, role, action, target, summary, and details. Filter by `target`; page by `before` id.

Admin UI facts (**Verified**): tabs "Жаңа бет", "Беттер", "Әкімшілер" (super only), "Журнал" (super only) (`AdminPanel.jsx:251-262`); page list has filters All / In review / Published (`:344-352`), multi-select bulk approve, live preview using `StandardPage` (`:491`); the admin UI text is Kazakh only. The admin is a separate full-screen view under the `#admin` hash (`App.jsx:176-186`). Pages cannot be deleted from the UI or API.

---

## 8. Data that exists only in the frontend

**Verified.** None of the following can be edited by an editor or served by the API. Editing them needs a code change.

| Location | What it holds | Languages | Notes |
|---|---|---|---|
| `client/src/constants/kuishiData.js:5,146,239` | `CANON_DATA` for `kuyshi` (**9** masters), `zhyrau` (**7**), `anshi` (**7**). Per master: `id, name, dates, region, school, schoolName, kuis[] (titles), bio, img` | **kk only for masters.** `kuyshi` has ru/en entries but with `masters: []`; `zhyrau` and `anshi` have only `kk` | The titles say 101 / 110 / 110 masters; only 23 are in the data. A comment says "Do not add facts without an archival source" |
| `client/src/constants/kuishiData.js:334` | `KUISHI_MASTERS` (the 9 küishi), used by the map | kk | The map groups them into regions by keyword match against `region` text (`HeritageMap.jsx:55-66,136+`) |
| `client/src/components/HeritageMap.jsx:23-66` | 9 region markers with name, lon/lat and keywords; simplified Kazakhstan outline; UI labels in kk/ru/en | kk/ru/en for labels | Per `FINAL.md:76`, 4 regions have no küishi data (Сарайшық, Маңғыстау, Ұлытау, Тарбағатай) |
| `client/src/constants/index.js:193-239` | `PROJECT_LEADERS` (3 people: Kuanyshev, Zhetibayev, Zhalyn). `name, role, badge, bio, initials, photo, highlights[]` | kk only | Only 1 has a photo |
| `client/src/constants/index.js:298-371` | `ALLEY_GALLERY` (8 items: image, genre, title, subtitle, desc, `targetSlug`). Feeds the home "Apple TV" gallery and the hero rotator (5 first) | kk, with ru/en subtitles for the hero only (`:373-384`) | |
| `client/src/constants/index.js:241-296` | `MURAGERLER_FEATURES` (4 items) | kk/ru/en | |
| `client/src/constants/index.js:16-74` | `NAV_LABELS_MAP`: navigation labels for the 17 slugs | kk/ru/en | New CMS pages get no translated label; they fall back to `page.title` |
| `client/src/constants/index.js:76-191` | `UI_TRANSLATIONS`: about 45 interface strings | kk/ru/en | |
| `client/src/pages/MuragerlerPage.jsx:21-404` | Programme: 4 directions with skills and duration, 3 mentors (names, roles, bios, photos), weekly schedule (4 slots), 4 stats ("150+", "100%"…), FAQ, application form labels | kk/ru/en | Provenance of mentors, schedule and statistics is **unconfirmed** (`FINAL.md:242,260`) |
| `client/src/pages/AlleyPage.jsx:15-224` | 4 architectural zones; stele catalogue by school: **19** names in kk (west 6, arka 5, south 4, jetysu 4); visitor guide (address, hours, bus routes, "QR audio tour") | kk/ru/en (ru/en lists are shorter) | The "QR audio tour" line claims audio recordings behind stele QR codes that do not exist (`:220`). Bus routes unconfirmed |
| `client/src/pages/MonumentPage.jsx:10-153` | 4 sculpture "anatomy" items, selected küis of Dina with tempo and story, text | kk/ru/en | |
| `client/src/pages/LibraryVolumePage.jsx:15-110` | 3 volumes: number, title, lead, cover, meta (pages, year, ISBN, editors, format), 4-5 chapters with page ranges, 2 sample "reader" pages each | **kk only** (only button labels switch kk vs ru) | ISBNs unconfirmed. "Download" is the **cover image** only (`:144-150`). The "reader" is a modal over 2 text pages |
| `client/src/pages/AboutDedicatedPages.jsx` | Leadership page (founder bio and quote, 3 council cards) and Charter page (objectives list) | **kk only** | |
| `client/src/pages/HomePage.jsx` | Hero strings, section headings ("Бір мұра. Үш дәстүр."), tooltips, English tagline, image captions, intro artwork | mixed; much is kk-only | Home also reads 4 blocks from CMS |
| `client/src/components/AppleTvMediaGallery.jsx:161` | A second `HERO_SLIDES` constant | - | duplicate of the one in constants |
| `client/public/images/*` | 27 files: photos of alley, monument, stele, founder, book covers, illustrations, ornaments | - | **Static files in the repo**, not in any storage service |

**Inferred.** The canon pages show 9 + 7 + 7 = 23 people, but titles and the contract talk about 101 + 110 + 110 = 321. Most people records do not exist anywhere yet.

---

## 9. Capabilities absent today

"Contract" = required by `FINAL.md` section 2 (contract §1.3-1.5 and Annex 1). Status: **required by contract, not implemented** (RCNI), **partial**, or **not in contract**.

| Capability | State today | Contract |
|---|---|---|
| **Image upload** | Absent. `image` block takes a URL or a path to a file in `client/public/images` | RCNI (staff must add photos without code: `FINAL.md:43,86`; R2 per §5.2) |
| **Audio storage and playback** | Absent. No `<audio>`, no block, no storage. The earlier fake audio buttons were removed (commit `6431a0a`). Page text still promises "audio archives" and "QR audio tour" | RCNI (audio recordings under heritage; `FINAL.md:58,236`) |
| **Video / YouTube embed** | Absent. No block | RCNI (`FINAL.md:95`) |
| **PDF / file hosting and download** | Absent. Only the cover image can be "downloaded" | RCNI (R2 for documents and books; `FINAL.md:94`) |
| **Sheet music** | Absent | RCNI (heritage section; `FINAL.md:58`) |
| **Trilingual article content** (kk/ru/en linked by shared id) | Absent. No `lang` or `translations` field; `lang` is stripped on save. Only UI strings and some hard-coded pages have ru/en | RCNI (`FINAL.md:67-69`) |
| **Language tabs in admin** | Absent | RCNI (follows from the above) |
| **Person pages with their own URL** | Absent. A person is a modal on a canon page; no slug, no per-person data in CMS | RCNI (QR on every article requires addressable articles; `FINAL.md:77`; audit A3 proposes this) |
| **QR button on every article** | Absent. Only a `qr` **block** exists (rendered in browser) | RCNI (`FINAL.md:77-78`) |
| **Free-link QR input field** | Absent | RCNI |
| **QR PNG download** | Absent | RCNI |
| **Public forms reaching the server** (Muragerler application) | Absent. `localStorage` only, key `kui-muragerler-apps` (`MuragerlerPage.jsx:431-437`); no endpoint, no admin inbox | Not named in the contract as a feature; **fake functionality is prohibited** (`FINAL.md:45,241`) |
| **Server-side search** | Absent. Client filter over title, description and block title/body of loaded pages (`App.jsx:132-139`). It does not search the canon people, küis, books or hard-coded pages | Search is not named in `FINAL.md` section 2; UI strings promise searching people, küis and books |
| **Sub-page breadcrumbs everywhere** | Partial: most pages have them, not all | RCNI fully (`FINAL.md:80`) |
| **Media library** on home | Partial: the home photo gallery exists (static); a media library does not | RCNI (`FINAL.md:56`) |
| **Content editable for all 17 pages** | Partial: 11 pages plus most of home are not driven by CMS | RCNI (`FINAL.md:86-89`) |
| **Delete page, reorder pages, change password, reject registration** | Absent | not in contract |
| **Reader accounts, Premium** | Absent | Not in the signed spec; benefits unknown (`FINAL.md:117-120`) |
| **Rich text, tables, columns in CMS** | Absent | not in contract |
| **Map data for 4 regions** | Absent (customer data needed) | RCNI, data blocker (`FINAL.md:76`) |
| **Backups, VPS, domain** | Absent | required (`FINAL.md:93-96`) |

Corrections to `ARCHITECTURE_AUDIT.md` (older than the code): problem #1 "admin cannot open existing pages" is fixed (`AdminPanel.jsx:55` uses all admin pages); problem #3 audio buttons were removed in `6431a0a`; problem #10 routing was rebuilt in `client/src/app/router.js`.

---

## 10. Constraints and implications for frontend design

1. **Every CMS page = banner + ordered, single-column stack of at most 10 block types** (section 5). New layouts need new block types, which means server enum change plus renderer plus editor. A design must be buildable from: kicker+title+text, pull-quote, image with caption, bullet list, numbered stats, card grid, callout with one link, QR. **Recommendation:** treat anything else (audio player, video, gallery, person profile, FAQ, timetable) as "needs new block, not yet built".
2. **No per-person URL.** People exist as in-page modals on 3 canon pages, with 9 + 7 + 7 records. Do not design a profile page, shareable link, "related people" or a per-person QR as if it existed.
3. **No audio, video, file or upload storage.** Do not draw play buttons, waveforms, download buttons, PDF readers or upload dropzones as working features. Images are only static files shipped with the site.
4. **Article content is Kazakh only.** A language switch changes navigation and UI text, but not article bodies in the CMS. Hard-coded pages vary: Muragerler, Alley and Monument have kk/ru/en; Library volumes, Leadership and Charter are kk only; canon masters are kk only. Design for text length variation and for a visible "not translated" state.
5. **Plain-text body.** A body field is one paragraph of plain text, with no bold, inline links, sub-headings or multiple paragraphs. Long articles will be a single block of text unless split across blocks.
6. **Navigation is fixed to 6 sections** (contract). Only 2 levels below; editors cannot add top-level sections. Section labels for new pages are not translated.
7. **No forms reach a server.** Any application, contact or feedback form is non-functional until an endpoint exists. Do not design success states that imply delivery.
8. **Search is title/description/block text of CMS pages only.** It cannot find a küishi, a küi title or a book chapter that lives in JSX. Do not promise an "all people" search or result types by entity.
9. **Cards are not links on standard pages and have no editable image.** A card grid linking to destination pages is only possible on the home page through a hidden `slug` field.
10. **Hash URLs.** Route form is `#/{kk|ru|en}/{slug}` and a slug is a single segment (no nested paths) (`client/src/app/router.js:6-25`; slug regex `index.js:96`). QR codes and shared links must use this shape.
11. **Admin is Kazakh-only and separate.** The admin editor is a form-based constructor with live preview, not a WYSIWYG. Editors, not designers, author content.
12. **Status states the public never sees.** Readers see only published content. `pending`, `rejected` and `pending_draft` exist only in admin; design them for admin only.
13. **Contract visual rules** (`FINAL.md:124-179`): 6 palette colours, light "parchment" and dark "Түнгі дала" themes, one typeface with Kazakh letters, no AI-looking imagery. Not repeated here; read the source.

---

## 11. Open questions

| # | Question | Who answers |
|---|---|---|
| 1 | Should the new design assume the planned model changes (translations, `person` page, `audio`/`video`/`gallery`/`faq`/`schedule` blocks, media upload) or only today's 10 blocks? `ARCHITECTURE_AUDIT.md` proposes them (A2-A4, A8) but none exists. | Owner |
| 2 | Is the Muragerler form to become real (needs endpoint plus admin inbox) or removed? | Owner and customer |
| 3 | Are the unconfirmed facts (ISBNs, mentors, schedule, "150+", bus routes, stele counts, "QR audio tour") to be kept, confirmed or hidden? Design may need to omit them. | Customer (`FINAL.md:260`) |
| 4 | Who provides ru/en article translations, and when? | Customer (`FINAL.md:259`) |
| 5 | Will search cover people and books (needs people in a data store or CMS) or only pages? | Owner |
| 6 | Is a rich-text body required for long articles? | Owner and customer |
| 7 | Should editors be able to create top-level sections or reorder navigation? (Contract says exactly 6.) | Owner |
| 8 | Can the public payload expose `created_by` / `approved_by` names? (Currently returned by `GET /api/pages`.) | Owner |
| 9 | When will the API be connected in production? Until then the live site cannot show admin-edited content at all. | Owner |
| 10 | Data for the 4 empty map regions and the remaining ~298 people of the canons. | Customer |
