# Development workflow

The main session coordinates. The architect produces the plan the main session follows; agents run one at a time when they write files.

## Steps, owners and outputs

| # | Step | Owner | Output | Gate to pass |
|---|---|---|---|---|
| 1 | Research | main session or `architect` | findings in the plan's "Context" section | files and current behaviour actually read, not assumed |
| 2 | Requirements | main session with the owner | acceptance criteria in the plan | every criterion is testable; out-of-scope listed (contract §8.3) |
| 3 | Architecture plan | `architect` | `docs/plans/<YYYY-MM-DD>-<slug>.md` | files to touch, steps, risks, verification per step |
| 4 | UI/UX direction | `ui-designer` | `docs/frontend/<slug>.md` | follows `visual-direction` skill; uses existing tokens or names new ones |
| 5 | Independent plan review | `code-reviewer` | review notes (chat or appended to the plan) | reviewer forms its own view from the code, then compares with the plan |
| 6 | Implementation | `frontend-engineer` | code diff in `client/**` | `npm run build` passes; only planned files changed |
| 7 | Browser verification | `qa-engineer` | `docs/frontend/qa/<YYYY-MM-DD>-<slug>.md` | follows `visual-testing` skill; screenshots or page reads as evidence |
| 8 | Code review | `code-reviewer` | findings ranked P0–P3 | no open P0/P1 |
| 9 | Regression testing | `qa-engineer` | appended to the QA report | key routes still work: home, a standard page, a dedicated page, `#admin` login screen, 404 |
| 10 | Final report | main session | message to the owner | what changed, what was verified and how, what was not verified |

Loop: P0/P1 findings in steps 7–9 go back to step 6 (or to step 4 if the problem is visual direction).

## Scaling the process

- **Trivial** (typo, one-line fix, no visual decision): steps 6, 7 (if visible), 10. State that steps were skipped.
- **Normal** (one component or page): all steps; step 4 may be a short note if existing patterns cover it.
- **Large** (new section, data-model change): all steps, plus an ADR in `docs/architecture/decisions/`.

## Rules

- Checkpoint first: work on a branch; commit before risky refactors.
- Stage explicitly (`git add <paths>`); review `git diff --staged` before committing.
- One writer at a time. Parallel only for read-only agents or disjoint file sets.
- No success claim without evidence. "Build passed" needs the build output; "works on mobile" needs a 375 px check.
- Content changes (people, dates, küi titles, numbers) always go through `content-guard`.
- Out-of-contract work (new sections, redesign) is flagged to the owner, not done silently.
