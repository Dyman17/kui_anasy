import { defaultPages } from './defaultPages.js';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getLocalPages() {
  try {
    const raw = localStorage.getItem('kui-custom-pages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore localStorage parse errors
  }
  return defaultPages;
}

function saveLocalPages(pages) {
  try {
    localStorage.setItem('kui-custom-pages', JSON.stringify(pages));
  } catch {
    // Ignore localStorage quota errors
  }
}

export async function getPages() {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/pages`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('API connection failed, falling back to static/cached pages:', err);
    }
  }
  return getLocalPages();
}

export async function savePage(page, token) {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/pages/${encodeURIComponent(page.slug)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify(page),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return result;
      if (response.status === 401) {
        throw new Error(result.error || 'Әкімші кілті дұрыс емес.');
      }
      throw new Error(result.error || 'Өзгерістерді сақтау мүмкін болмады.');
    } catch (err) {
      if (err.message.includes('Әкімші кілті')) throw err;
      console.warn('API save failed, saving to local demo storage:', err);
    }
  }

  const current = [...getLocalPages()];
  const index = current.findIndex((item) => item.slug === page.slug);
  const updated = { ...page, updated_at: new Date().toISOString() };
  if (index >= 0) {
    current[index] = updated;
  } else {
    current.push(updated);
  }
  saveLocalPages(current);
  return updated;
}

export async function createPage(page, token) {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify(page),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return result;
      if (response.status === 401) {
        throw new Error(result.error || 'Әкімші кілті дұрыс емес.');
      }
      throw new Error(result.error || 'Бөлімді жасау мүмкін болмады.');
    } catch (err) {
      if (err.message.includes('Әкімші кілті')) throw err;
      console.warn('API create failed, saving to local demo storage:', err);
    }
  }

  const current = [...getLocalPages()];
  const exists = current.some((item) => item.slug === page.slug);
  if (exists) {
    throw new Error('Мұндай сілтемесі бар бөлім бар.');
  }
  const created = { ...page, is_custom: true, updated_at: new Date().toISOString() };
  current.push(created);
  saveLocalPages(current);
  return created;
}

export function resetLocalPages() {
  try {
    localStorage.removeItem('kui-custom-pages');
  } catch {}
  return defaultPages;
}

