# Frontend documentation — «Күй анасы»

All design and frontend documents live in this folder. Read them in the order below.

| # | Document | What it is | Status |
|---|---|---|---|
| 1 | [FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) | Audit of the site before the redesign: every route at desktop and 375 px, problems ranked P0–P3, what to keep | draft (05.11.2026) |
| 2 | [BACKEND_CAPABILITIES.md](BACKEND_CAPABILITIES.md) | What the API and CMS actually support (endpoints, tables, block types, admin flow) and what the contract needs that is not built | draft |
| 3 | [FRONTEND_DESIGN_BRIEF.md](FRONTEND_DESIGN_BRIEF.md) | Page-by-page brief for design tools (Stitch etc.); every feature tagged exists / contract-not-built / open decision | draft |
| 4 | [VISUAL_CONCEPTS.md](VISUAL_CONCEPTS.md) | Four visual directions compared, Stitch prompts, tool research | draft — superseded by #6 |
| 5 | [FRONTEND_QUALITY_STANDARD.md](FRONTEND_QUALITY_STANDARD.md) | 157 testable acceptance criteria, scorecard, definition of done | draft |
| 6 | [DARK_HERITAGE_REDESIGN.md](DARK_HERITAGE_REDESIGN.md) | **Current direction.** Implementation brief for the owner's dark forest/gold design: tokens, header, hero, every page, phases 1–4 | implemented (PR #1) |

## QA reports — [qa/](qa/)

| Report | Scope |
|---|---|
| [qa/2026-11-05-dark-redesign-phase-1-2.md](qa/2026-11-05-dark-redesign-phase-1-2.md) | Shell, header, QR popover, home hero — 8 widths × kk/ru/en |
| [qa/2026-11-05-dark-redesign-phase-3-4.md](qa/2026-11-05-dark-redesign-phase-3-4.md) | Home sections, all inner pages, 404, admin login |

Older phase reports (`PHASE_2_QA.md`, `PHASE_3_QA.md`) and `ARCHITECTURE_AUDIT.md` stay in the repo root.

## Conventions

- **Briefs** are written by the `ui-designer` agent (skill `visual-direction`), one file per feature or page: `docs/frontend/<slug>.md`. A brief is approved when the owner or main session sets `Status: approved` at the top; the `frontend-engineer` implements only approved briefs. Required sections: Status, Goal and audience, Content inventory, Composition per breakpoint, Typography, Colour and surfaces, Interaction and motion, States, Accessibility, Tokens, Out of scope.
- **QA reports** are written by the `qa-engineer` agent (skill `visual-testing`), one per run: `docs/frontend/qa/<YYYY-MM-DD>-<slug>.md` — see [qa/README.md](qa/README.md).
- Related elsewhere: architecture in `docs/architecture/`, implementation plans in `docs/plans/`, agent workflow in `docs/ai/`.
