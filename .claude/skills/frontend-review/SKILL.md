---
name: frontend-review
description: Structured review procedure for frontend diffs and plans — correctness, regressions, architecture, duplication, component size, design-system compliance, accessibility, performance and scope — with severity levels and a report format. Use when reviewing a plan, a diff, a branch or a PR touching client code.
---

# Frontend review

Review the code, not the description. Every finding needs a location and a concrete failure scenario.

## Procedure
1. **Establish the diff.** `git status`, `git diff --stat`, then `git diff` (or `git diff <base>...HEAD`). List files changed; flag any outside the plan's scope.
2. **Understand intent.** Read the plan (`docs/plans/`) and brief (`docs/frontend/`). Note acceptance criteria.
3. **Read around the change.** For each changed function/component, find its callers (`grep -rn "ComponentName" client/src`). Behaviour change for a caller = potential regression.
4. **Build.** `npm run build` — a failure is P0.
5. **Walk the checklist below.**
6. **Write the report** (format at the end).

## Checklist
**Correctness & regressions**
- State: stale closures in effects, missing dependencies, state not reset on route change, leaking listeners/timers (every `addEventListener`/`setInterval` has cleanup).
- Routing: links use `buildHref`/real `href`; unknown slugs reach 404; `#admin` and language prefixes still work.
- Data: handles empty arrays, missing fields, slow/failed fetch; no crash on `undefined`.
- No fake functionality: every button/form does what its label says.

**Architecture & maintainability**
- Component > ~300 lines or doing several jobs → propose split.
- Duplicated logic (copy-pasted breadcrumbs, modals, slug helpers): search for an existing helper; name both locations.
- Props drilled through 3+ levels where context or composition would be simpler.
- Dead code, unused imports, commented-out blocks added.

**Design system & visual**
- Raw colours/sizes where tokens exist; new breakpoints, z-index values or font families.
- Visible change without an approved brief → flag.
- `!important` added; selectors that rely on deep nesting.

**Accessibility** (see `accessibility` skill): semantic elements, focus visible, dialog pattern, labels, alt, contrast, `lang`.

**Performance**
- Large images without `width`/`height`/`loading="lazy"`; heavy imports in the public bundle that belong in a lazy chunk (admin, QR); re-renders from objects created in render passed to memoized children; layout-thrashing animations.

**Content & security**
- New facts/numbers without source → route to `content-guard`.
- `dangerouslySetInnerHTML` with CMS/user content; URLs from content not restricted to `http(s):`; secrets or personal data in code.

**Scope**
- Changes unrelated to the task; new dependencies; edits to protected files (`FINAL.md`, QA reports, `.agents/`).

## Severity
P0 build/security/data loss/core route broken · P1 user-facing bug, regression, a11y blocker, invented content · P2 maintainability · P3 nit (max five).

## Report format
```
REVIEW — <scope> — base <ref>
Verdict: approve | approve with fixes | changes required
P1 client/src/x.jsx:42 — <problem> — <when it fails> — <fix>
…
Scope check: files outside plan: <list or none>
Not checked: <e.g. browser behaviour — QA>
```
