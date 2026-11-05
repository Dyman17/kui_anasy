# 0001 — AI development system (agents, skills, workflow)

- **Status:** accepted
- **Date:** 2026-11-05
- **Decided by:** product owner (approved proposal), main session (implementation)

## Context
Development is done by Claude Code sessions. Before this decision the repo had three role notes in `.claude/agents/` without YAML frontmatter (never loaded by Claude Code) and a `kui-anasy-design` skill that described an abandoned palette and type system. Front-end quality is the main acceptance risk; the deadline is 16.11.2026.

## Options
1. **No structure** — one general session does everything. Cheap, but no independent review and visual decisions drift.
2. **Many parallel agents** — fast on paper, but conflicting edits on shared files (`App.jsx`, `styles.css`).
3. **Small specialised team, sequential writers, main session orchestrates** — independent review and design gate, no edit conflicts.

## Decision
Option 3. Six subagents (architect, ui-designer, frontend-engineer, code-reviewer, qa-engineer, content-guard), all `model: sonnet`; seven project-agnostic method skills plus the project direction skill `kui-anasy-design`; ten-step workflow in `docs/ai/WORKFLOW.md`.

- The project skill is named `visual-direction`, not `frontend-design`, because a global user skill `frontend-design` exists and the names would collide.
- `design-guard` was merged into `ui-designer`, `qa-auditor` into `qa-engineer`; `content-guard` was kept and given valid frontmatter.
- Write scopes are documented instructions, not enforced boundaries.

## Consequences
- Every non-trivial change gets a plan, a design brief, an independent review and a browser check, which costs extra turns.
- Opus is used only when the owner switches the main session manually.
- Browser checks depend on the desktop app's built-in browser; terminal-only sessions must report visual checks as not done.
- The stale palette/type sections in `client/README.md` still need a separate update (out of scope here).
