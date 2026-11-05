import { useEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside `ref` while `active`, moves focus in on open and returns it to the
 * previously focused element on close (WCAG modal dialog pattern).
 */
export function useFocusTrap(ref, active, { initialFocus } = {}) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const container = ref.current;
    const previous = document.activeElement;
    const getItems = () => Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    const first = (initialFocus && container.querySelector(initialFocus)) || getItems()[0];
    first?.focus();

    const onKey = (event) => {
      if (event.key !== 'Tab') return;
      const items = getItems();
      if (!items.length) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    };
    container.addEventListener('keydown', onKey);
    return () => {
      container.removeEventListener('keydown', onKey);
      if (previous && typeof previous.focus === 'function' && document.contains(previous)) previous.focus();
    };
  }, [ref, active, initialFocus]);
}
