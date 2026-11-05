# CLAUDE.md — «Күй анасы» (kui_anasy)

Digital encyclopedic portal + CMS for the «КҮЙ АНАСЫ» foundation (Kazakh küi, zhyrau and song heritage).
Contract deadline: **16.11.2026**. Source of truth for scope: `FINAL.md` (wins over older notes).

## Stack and commands

npm workspaces: `client` (React 18 + Vite 6, plain JS, no router library, no TypeScript, no ESLint, no unit tests) and `server` (Express + pg + zod).

| Task | Command (run from repo root) |
|---|---|
| Install | `npm install` |
| API + web together | `npm run dev` |
| Web only (port 5173) | `npm run dev -w client` |
| Production build (the only automated front-end check) | `npm run build` |
| Preview built client | `npm run preview -w client` |
| API e2e (needs a running server and a **disposable** DB, reads `.env`) | `API_URL=http://localhost:4000 npm run test:e2e -w server` |
| AI-design tell scanner | `node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src` |

Browser preview in the desktop app: `preview_start` with name `kui-anasy-web` (`.claude/launch.json`).

## Where things are

- `client/src/App.jsx` — app shell, page dispatch. `client/src/app/router.js` — hash router (`#/ru/slug`).
- `client/src/pages/`, `client/src/components/`, `client/src/admin/` — UI. `client/src/styles.css` — global CSS monolith (~8.1k lines; refactor is a **separate, unscheduled task**).
- `server/src/index.js` — API; `server/src/auth.js` — two-tier admin auth.
- Architecture: `docs/architecture/ARCHITECTURE.md`; decisions: `docs/architecture/decisions/`; full audit: `ARCHITECTURE_AUDIT.md`.

## Non-negotiable project rules

1. **No invented facts.** Names, dates, küi titles, statistics come from the customer or verified sources. Unverified → hide, never fill in.
2. **No fake functionality.** Every button, form and player must actually work, or it is not shipped.
3. **Kazakh Cyrillic must render** (ә ғ қ ң ө ұ ү һ і, upper and lower) in every font and component.
4. **No new npm dependencies** without explicit owner approval. No external font CDNs.
5. **Public repository.** Never commit secrets, `.env`, contract/personal data, or customer PDFs/DOCX.
6. Preserve existing functionality. Do not touch `FINAL.md`, `PHASE_*_QA.md`, `ARCHITECTURE_AUDIT.md`, `.agents/`, `agent/`, `skills-lock.json` unless the task is about them.
7. Never claim success without verification evidence (build output, browser check, test output).
8. Git: checkpoint (branch or commit) before significant changes; stage files explicitly, never `git add -A`.

## Development workflow (summary — full version: `docs/ai/WORKFLOW.md`)

1. Research → 2. Requirements → 3. Architecture plan (**architect**) → 4. UI/UX direction (**ui-designer**) → 5. Independent plan review (**code-reviewer**) → 6. Implementation (**frontend-engineer**) → 7. Browser verification (**qa-engineer**) → 8. Code review (**code-reviewer**) → 9. Regression (**qa-engineer**) → 10. Final report.

- The main session orchestrates; subagents cannot spawn other subagents.
- Small fixes (one file, no visual decision) may skip steps 3–5; say so explicitly.
- The frontend-engineer does **not** invent major visual decisions: it needs an approved brief in `docs/frontend/` or an existing token/pattern to follow.
- Only one agent edits files at a time. Read-only agents (code-reviewer, content-guard) may run in parallel.

## Agents (`.claude/agents/`, details: `docs/ai/AGENTS.md`)

| Agent | Use for | Writes |
|---|---|---|
| `architect` | analysis, plans, task breakdown, technical trade-offs | `docs/architecture/`, `docs/plans/` |
| `ui-designer` | visual direction, composition, type, colour, UX patterns | `docs/frontend/` |
| `frontend-engineer` | implementation in React/CSS, a11y, responsive, performance | `client/` |
| `code-reviewer` | independent review of plans and diffs | nothing (report) |
| `qa-engineer` | browser, responsive, regression testing | `docs/frontend/qa/` |
| `content-guard` | historical-fact and source check of content | nothing (report) |

Write scopes are instructions, not a sandbox (Bash can write anywhere). Check `git status` after each agent run.

## Skills (`.claude/skills/`)

Method skills (project-agnostic): `visual-direction`, `design-system`, `responsive-design`, `motion-design`, `accessibility`, `frontend-review`, `visual-testing`.
Project direction: `kui-anasy-design` (current palette, type, page character). Third-party: `avoid-ai-design`, `interface-design`.
The global `frontend-design` skill is **not** the project skill — use `visual-direction` here.
