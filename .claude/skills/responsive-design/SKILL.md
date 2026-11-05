---
name: responsive-design
description: Content-first responsive layout method — breakpoints, fluid type and spacing, reading order, overflow and long-text handling, touch targets — with a verification matrix. Use when building or changing any layout, and when a page breaks on mobile or tablet.
---

# Responsive design

Design for the narrowest real device first, then add layout as space allows. The content order on mobile is the true information hierarchy.

## Breakpoints
- Target set: **480 / 768 / 1024 px** (min-width queries for added layout). Existing CSS uses many more; do not add new ones — map to the nearest of these three.
- Test widths: **320, 375, 768, 1280** (plus 390 for common phones when names/numbers are tight).

## Method
1. **Mobile first.** Single column in reading order. Write base styles without media queries.
2. **Breakpoints where content breaks**, not where devices are: widen until the line gets too long or a layout gets awkward, then add a column.
3. **Fluid in between.** `clamp()` for headline sizes and section spacing; `min()`/`max()` for widths; `minmax()` and `auto-fit` for grids that must reflow.
4. **Intrinsic sizing.** Prefer `max-width` + `width: 100%` over fixed widths; `aspect-ratio` on media to prevent layout shift; `object-fit: cover` with a deliberate `object-position`.
5. **Measure.** Body text 55–75 characters (`max-width: 65ch` area). Body ≥ 16 px desktop, ≥ 15 px mobile.
6. **Touch.** Targets ≥ 44×44 px with ≥ 8 px spacing. Hover-only affordances need a tap/focus equivalent.
7. **Navigation.** Collapsed menu below 768 px; it must open, close (button + Esc), and not scroll the page behind it.

## Long text and languages
- Kazakh and Russian words are long: test headings with the longest real title. Use `overflow-wrap: anywhere` on user/CMS content containers, `hyphens: auto` only with correct `lang` on the element.
- Person names in headings stay on one line (`white-space: nowrap`) — so make sure the font size allows the longest name at 320 px (use `clamp`).
- Numbers in stat rows: keep each value + label together; allow wrapping between items, never inside a number.

## Common failures to check
Horizontal scroll (find with `document.documentElement.scrollWidth > innerWidth`); tooltips or popovers off-screen; fixed heights clipping text; images stretched; sticky header covering anchored headings (`scroll-margin-top`); 100vh on mobile (use `100dvh` or `min-height`).

## Verification
For each test width: no horizontal scroll, readable text, no overlapped/clipped elements, menu works, images keep aspect ratio. Record the matrix in the QA report (`visual-testing` skill).

## Quality criteria
- [ ] Works at 320 px with the longest real content.
- [ ] Only the project breakpoints are used.
- [ ] No horizontal scroll at any test width.
- [ ] Touch targets ≥ 44 px; hover content reachable by tap/focus.
