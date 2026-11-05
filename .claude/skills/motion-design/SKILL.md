---
name: motion-design
description: Rules for purposeful UI motion — when to animate, durations, easing, what properties to animate, reduced-motion support and performance. Use when adding transitions, carousels, reveal effects, page or modal animations, or reviewing motion that feels arbitrary.
---

# Motion design

Motion is information: it shows where something came from, what changed, or what is interactive. If it explains nothing, remove it.

## Decide first
Animate only if the motion answers one of these:
1. **Feedback** — the press, hover or focus registered.
2. **Continuity** — an element opens from / closes to its trigger; content swaps without a jump.
3. **Orientation** — the user sees where new content came from (drawer from the side, menu from the button).
4. **Attention** — one important change the user might miss (saved, error). Rarely.

Not valid reasons: "it feels alive", staggering every list item, parallax for its own sake, scroll-triggered fade-ins on every section.

## Timing and easing
| Kind | Duration | Easing |
|---|---|---|
| Hover / press feedback | 100–150 ms | ease-out |
| Small element in/out (tooltip, dropdown) | 150–200 ms | ease-out in, ease-in out |
| Panels, modals, drawers | 200–300 ms | `cubic-bezier(0.2, 0, 0, 1)` in; faster out |
| Large page-level transitions | ≤ 400 ms | as above |
Exits are faster than entrances. Define durations/easings as CSS variables and reuse them.

## Implementation
- Animate `transform` and `opacity` only. Avoid animating `width`, `height`, `top`, `left`, `box-shadow`, `filter` on large areas.
- CSS transitions first; JS only when state requires it. No new animation libraries.
- Carousels/auto-rotation: pause on hover and focus, provide a visible pause control, stop when the tab is hidden, and never auto-advance faster than ~5 s.
- Smooth scrolling libraries hijack scroll and conflict with modals and assistive tech; do not add new ones.

## Reduced motion (mandatory)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```
Plus: in JS, check `matchMedia('(prefers-reduced-motion: reduce)')` before auto-play, parallax or programmatic smooth scroll. Opacity cross-fades may remain; movement should not.

## Quality criteria
- [ ] Each animation has a stated purpose from the list above.
- [ ] Durations within the table; exits faster than entrances.
- [ ] Only transform/opacity animated.
- [ ] Works with reduced motion (verify by emulating it).
- [ ] Auto-moving content can be paused.
