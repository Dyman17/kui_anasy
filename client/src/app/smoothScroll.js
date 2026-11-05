// In-page scrolling for hero buttons. Lenis (main.jsx) listens to native scroll events and stays in sync,
// so a native smooth scroll starts at once; Lenis.scrollTo waits for its own animation frame loop.
export function scrollToElement(target, { reduced = false } = {}) {
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}
