---
name: design-system
description: How to use, extend and audit design tokens (colour, type, spacing, radius, z-index, breakpoints) and shared component patterns so UI stays consistent. Use when writing CSS, adding a component, introducing a new value, or checking for colour/spacing drift.
---

# Design system

The system is the set of named decisions in code. Consistency comes from reusing names, not from remembering values.

## Where it lives (this repo)
- Tokens: `client/src/styles.css`, `:root` block (colours, fonts, spacing). Dark/alternate themes override the same names.
- Component CSS: co-located `Component.css` next to `Component.jsx` (target pattern).
- Project direction and allowed palette: skill `kui-anasy-design`.

## Rules when writing CSS
1. **Search before adding.** `grep -n "^\s*--" client/src/styles.css` to list tokens. Reuse the closest semantic token.
2. **Semantic over raw.** Use role tokens (`--text-primary`, `--bg-surface`, `--line`, `--accent-gold`) in components; raw palette tokens (`--gold`, `--forest`) only inside token definitions.
3. **No new literals** when a token exists: no raw hex, rgb or arbitrary px for colour, spacing or font size. If a value is truly new, add a named token in `:root` (with a comment stating its role) — only when the plan or brief approves it.
4. **Spacing** uses the scale (`--spacing-xs` … `--spacing-xxl`, 4 px base). Odd values (13px, 27px) are a smell.
5. **Type**: font families only through `--font-*` variables. Do not add `@font-face` or external font links.
6. **Radius**: small and consistent; large radii and pills only where the direction calls for them.
7. **z-index**: use a small ordered set (base, raised, sticky header, overlay, modal, toast). Never 9999-style values.
8. **Breakpoints**: use the project set (see `responsive-design`); do not invent a new one for one component.
9. **`!important`**: only to beat third-party CSS; never to win against our own selectors — fix specificity instead.
10. **States**: every interactive component defines hover, focus-visible, active, disabled using tokens.

## Adding a shared component
- Check for an existing one (`client/src/components/`) and extend it with a prop before creating a near-duplicate.
- API: few props, sensible defaults, `className` passthrough. Keep it under ~200 lines.
- Document variants in a comment at the top of the file if there are more than two.

## Drift audit (quick, read-only)
```bash
grep -oE "#[0-9a-fA-F]{3,8}\b" client/src/styles.css | sort | uniq -c | sort -rn | head -20
grep -c "!important" client/src/styles.css
grep -oE "z-index:\s*[0-9]+" client/src/styles.css | sort | uniq -c
grep -oE "@media[^{]+" client/src/styles.css | sort | uniq -c
node .claude/skills/avoid-ai-design/scripts/detect.mjs client/src
```
Report counts and the top offenders; do not mass-rewrite as part of an unrelated task.

## Quality criteria
- [ ] No new raw colour/size literals in the diff where a token exists.
- [ ] New tokens are semantic, commented and approved.
- [ ] No new breakpoint, z-index value or font family introduced ad hoc.
- [ ] Component states use tokens; focus-visible is distinct.
