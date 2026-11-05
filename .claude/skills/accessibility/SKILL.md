---
name: accessibility
description: Practical WCAG 2.2 AA checklist and fixes for React UIs — semantics, keyboard, focus, dialogs, forms, images, contrast, language attributes and Cyrillic/Kazakh text. Use when building components, modals, forms or navigation, and when testing or reviewing UI for accessibility.
---

# Accessibility

Target: WCAG 2.2 AA. The audience includes older readers and visitors arriving by QR code on phones; legibility and simple interaction matter more than polish.

## Build rules
**Semantics**
- Use real elements: `<button>` for actions, `<a href>` for navigation (hash routes included), `<nav>`, `<main>`, `<header>`, `<footer>`, one `<h1>` per page, headings in order.
- No `div onClick`. If unavoidable: `role`, `tabIndex=0`, Enter/Space handlers — but prefer the native element.

**Keyboard and focus**
- Everything operable by keyboard; logical Tab order (DOM order = visual order).
- Visible `:focus-visible` style with ≥ 3:1 contrast against its background. Never `outline: none` without a replacement.
- Skip link to `<main>` on pages with long navigation.

**Dialogs, menus, popovers**
- Modal: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; focus moves into it on open, is trapped while open, returns to the trigger on close; Esc closes; background not scrollable. Native `<dialog>` with `showModal()` gives most of this.
- Menu buttons: `aria-expanded`, `aria-controls`. Tooltips with essential info must also work on focus and tap.

**Forms**
- Every input has a visible `<label>` (placeholder is not a label). Errors in text next to the field, linked with `aria-describedby`, announced (`aria-live="polite"` region). Don't rely on colour alone.

**Images and media**
- Informative images: `alt` describing content and purpose. Decorative: `alt=""` or CSS background, patterns `aria-hidden="true"`.
- Illustrations of people: do not name a person in `alt` unless the image is a verified portrait.
- Audio/video: visible controls, no autoplay with sound, captions/transcript when available.

**Colour and text**
- Contrast: 4.5:1 body text, 3:1 large text (≥ 24 px or 19 px bold) and UI boundaries. Check text over images with an overlay.
- Text resizes to 200% without loss; no text in images.

**Language**
- `<html lang>` matches the content language (`kk`, `ru`, `en`); mixed-language fragments get their own `lang`.
- Kazakh Cyrillic (ә ғ қ ң ө ұ ү һ і, all cases) must render in the chosen font — no fallback-font holes. Avoid `text-transform: uppercase` on fonts that lack uppercase Kazakh glyphs.

## Test workflow
1. Keyboard only: Tab through the page; open and close every overlay; submit forms.
2. Inspect the accessibility tree (`read_page`) for names/roles of controls and heading order.
3. Contrast: compute key pairs from the tokens (or `javascript_tool` with `getComputedStyle`).
4. Emulate reduced motion and 200% zoom (resize to 640 px as a proxy).
5. Screen-reader spot check if available; otherwise note "not tested with a screen reader".

## Quality criteria
- [ ] No keyboard traps; all actions reachable; focus always visible.
- [ ] Dialogs meet the modal pattern above.
- [ ] All controls have accessible names; headings are ordered.
- [ ] Contrast meets AA on every surface used.
- [ ] `lang` is correct; Kazakh glyphs render.
