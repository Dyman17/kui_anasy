import { useEffect, useState } from 'react';

// Tiny hash router. Supported forms:
//   #slug   #/slug   #/ru/slug   #/ru   #admin   #admin/...
// Empty hash means the home page.
const LANGS = ['kk', 'ru', 'en'];
const HOME_SLUG = 'home';

export function parseHash(hash = '') {
  const raw = String(hash).replace(/^#/, '').replace(/^\/+/, '');
  if (raw === 'admin' || raw.startsWith('admin/')) {
    return { admin: true, adminPath: raw.slice('admin'.length).replace(/^\//, ''), lang: null, slug: HOME_SLUG };
  }
  const parts = raw.split('/').filter(Boolean);
  let lang = null;
  if (parts.length > 0 && LANGS.includes(parts[0])) lang = parts.shift();
  let slug = HOME_SLUG;
  if (parts.length > 0) {
    try { slug = decodeURIComponent(parts.join('/')); } catch { slug = parts.join('/'); }
  }
  return { admin: false, adminPath: '', lang, slug };
}

export function buildHref(slug, lang) {
  const s = !slug || slug === HOME_SLUG ? '' : slug;
  if (lang && LANGS.includes(lang)) return `#/${lang}${s ? `/${s}` : ''}`;
  return s ? `#${s}` : '#';
}

export function navigate(slug, lang) {
  const href = buildHref(slug, lang);
  if (window.location.hash === href || (href === '#' && !window.location.hash)) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.location.hash = href;
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    onChange();
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
