# Architecture (current state, 05.11.2026)

Short, maintained description of how the system works today. History and the full problem list: `ARCHITECTURE_AUDIT.md`. Decisions: `docs/architecture/decisions/`.

## System

```
Browser ──► client (React 18 SPA, Vite build, hash routes)
              │  fetch JSON
              ▼
           server (Express, zod validation) ──► PostgreSQL
```

Hosting today: Vercel (client) + Render (API). Contract target: one VPS (Nginx + Node + PostgreSQL).

## Client (`client/`)

- Entry: `client/src/main.jsx` → `client/src/App.jsx` (shell, page dispatch, state for pages and session).
- Routing: `client/src/app/router.js` — hash router. Forms: `#slug`, `#/ru/slug`, `#admin/...`; empty hash = home. `client/src/app/useDocumentMeta.js` sets title and `html lang`.
- Pages: `client/src/pages/` — `StandardPage` renders CMS blocks via `client/src/components/ContentBlock.jsx`; several pages (`MuragerlerPage`, `AlleyPage`, `MonumentPage`, `CanonPage`, `LibraryVolumePage`, `AboutDedicatedPages`) still hold content in JSX (audit decision A1 is to move it into the CMS).
- Admin: `client/src/admin/` (CMS editor, auth view, audit log), served from `#admin` in the same bundle.
- API client: `client/src/api.js`. Static content fallback: `client/src/defaultPages.js` (duplicated in `server/src/defaultPages.js`).
- Styling: global `client/src/styles.css` (~8.1k lines, tokens in `:root`) plus co-located CSS for `HeritageMap`, `AuditLogView`, `NotFoundPage`. Co-location is the target pattern.
- Fonts: local files in `client/fonts/` (no CDN). Assets: `client/public/` (images, brand marks, SVG patterns).

## Server (`server/`)

- `server/src/index.js`: REST API. Public: `GET /api/health`, `GET /api/pages`. Auth: master login, editor register/login/logout/me. Admin: editors (approve/delete), pages (create, update, approve, reject), audit log.
- `server/src/auth.js`: two tiers — super admin (master token) and editors (approved by super admin); server-side sessions.
- Data model: a page = slug + metadata + ordered `blocks` (JSONB). Edits by editors go through moderation; every action is written to the audit log.
- Test: `server/test/e2e.mjs` against a running server and a disposable DB.

## Known structural debt (tracked, not part of AI-infrastructure work)

CSS monolith and colour/spacing drift; 8 font families vs the client's request for one; hard-coded content pages; trilingual content not modelled; no media upload. See `ARCHITECTURE_AUDIT.md` §2 and §5 for the plan.

## Conventions

- Plain JS + JSX, ES modules, functional components and hooks.
- New component CSS lives next to the component (`Component.css`).
- No new dependencies without owner approval.
- Server input is validated with zod; never trust client-side checks alone.
