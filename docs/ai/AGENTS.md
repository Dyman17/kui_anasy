# Agent responsibilities

Six project subagents live in `.claude/agents/`. All use `model: sonnet` (the alias resolves to the current Sonnet available to the account; it is not a pinned version). For hard architectural calls the owner switches the **main session** to Opus manually — subagents are not escalated automatically.

## Constraints of the platform

- Subagents cannot start other subagents. The **main session** runs the workflow (`docs/ai/WORKFLOW.md`) and passes each agent's output to the next one.
- Each subagent starts with a fresh context: the brief you give it must include the goal, the relevant files and links to prior artifacts (plan, design brief, QA report).
- `tools:` in the frontmatter is a real allowlist. **Write scopes are not**: they are instructions. Any agent with `Bash` can technically write anywhere. Verify with `git status` after every run.
- Browser tools (`mcp__Claude_Browser__*`) exist only when Claude Code runs inside the Claude desktop app. In a plain terminal session they are absent; agents must then say "not verified in a browser" instead of guessing.

## Matrix

| Agent | Owns | Tools | Intended write scope | Must not |
|---|---|---|---|---|
| `architect` | repo analysis, plans, task breakdown, trade-offs, ADRs | Read, Grep, Glob, Bash, Write, Edit | `docs/architecture/**`, `docs/plans/**` | modify application source (`client/**`, `server/**`), make visual decisions |
| `ui-designer` | visual direction, composition, typography, colour, UX patterns, component appearance | Read, Grep, Glob, Write, Edit, WebSearch, WebFetch, browser (view only) | `docs/frontend/**` | edit code or CSS, add fonts/dependencies |
| `frontend-engineer` | React components, CSS, responsive, motion, a11y, performance | Read, Grep, Glob, Edit, Write, Bash, browser | `client/**` | invent major visual decisions without an approved brief, touch `server/**` unless the plan says so, add dependencies |
| `code-reviewer` | independent review of plans and diffs | Read, Grep, Glob, Bash (read-only commands) | none | edit files, rubber-stamp the architect's conclusions |
| `qa-engineer` | functional, browser, responsive, regression testing | Read, Grep, Glob, Bash, Write, browser | `docs/frontend/qa/**` | fix bugs itself, claim checks it did not run |
| `content-guard` | historical facts, sources, Kazakh/Russian/English terminology | Read, Grep, Glob | none | invent or "complete" facts |

## Hand-offs

```
architect ──plan──► ui-designer ──brief──► code-reviewer (plan review)
                                                │ approved
                                                ▼
                     frontend-engineer ──diff──► qa-engineer (browser) ──► code-reviewer (code) ──► qa-engineer (regression)
content-guard: called whenever content (names, dates, texts) changes, in parallel with review.
```

## Which skills each agent preloads

| Agent | Skills |
|---|---|
| architect | — (reads `docs/architecture/` instead) |
| ui-designer | visual-direction, design-system, kui-anasy-design |
| frontend-engineer | design-system, responsive-design, motion-design, accessibility |
| code-reviewer | frontend-review |
| qa-engineer | visual-testing, accessibility |
| content-guard | — |

## When to call which agent

- "Plan feature X" / "is approach A or B better?" → `architect`.
- "How should this page look?" / "the design feels generic" → `ui-designer`.
- "Build it" (after an approved plan and brief) → `frontend-engineer`.
- "Review this" / before every commit of non-trivial work → `code-reviewer`.
- "Does it work on mobile?" / before merge → `qa-engineer`.
- Any change to biographies, dates, küi names, statistics → `content-guard`.
