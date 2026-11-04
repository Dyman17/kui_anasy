import { useEffect } from 'react';

const HTML_LANG = { kk: 'kk', ru: 'ru', en: 'en' };

// Keeps <title> and <html lang> in sync with the current page and language.
export function useDocumentMeta({ title, suffix, lang }) {
  useEffect(() => {
    document.title = title && suffix ? `${title} — ${suffix}` : (title || suffix || document.title);
  }, [title, suffix]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang] || 'kk';
  }, [lang]);
}
