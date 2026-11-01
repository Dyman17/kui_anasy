import { defaultPages } from './defaultPages.js';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const DEFAULT_SUPER_TOKEN = (import.meta.env.VITE_ADMIN_TOKEN || 'kui_anasy_admin_secret_key_2026_xyz!').trim();
const CURRENT_PAGES_VERSION = 'v2_real_subpages_2026';

function getLocalPages() {
  const defaults = defaultPages.map((p) => ({
    ...p,
    status: p.status || 'published',
    created_by: p.created_by || 'Бас әкімші',
    approved_by: p.approved_by || 'Бас әкімші',
    approved_at: p.approved_at || '2026-10-29T10:00:00.000Z',
    change_summary: p.change_summary || 'Бастапқы нұсқа',
  }));

  try {
    const savedVersion = localStorage.getItem('kui-pages-version');
    const raw = localStorage.getItem('kui-custom-pages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (savedVersion !== CURRENT_PAGES_VERSION) {
          const defaultSlugs = new Set(defaults.map((d) => d.slug));
          const userCreated = parsed.filter((p) => !defaultSlugs.has(p.slug));
          const merged = [...defaults, ...userCreated];
          saveLocalPages(merged);
          localStorage.setItem('kui-pages-version', CURRENT_PAGES_VERSION);
          return merged;
        }

        const existingSlugs = new Set(parsed.map((p) => p.slug));
        const missing = defaults.filter((d) => !existingSlugs.has(d.slug));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          saveLocalPages(merged);
          return merged;
        }
        return parsed;
      }
    }
    localStorage.setItem('kui-pages-version', CURRENT_PAGES_VERSION);
  } catch {
    // Ignore localStorage parse errors
  }
  return defaults;
}

function saveLocalPages(pages) {
  try {
    localStorage.setItem('kui-custom-pages', JSON.stringify(pages));
  } catch {
    // Ignore localStorage quota errors
  }
}

// User / Admin Accounts management
export function getAdminAccounts() {
  try {
    const raw = localStorage.getItem('kui-admin-accounts');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'editor-1',
      fullName: 'Айдос Смағұлов',
      username: 'aidos',
      password: 'password123',
      status: 'approved',
      registeredAt: '2026-10-29T12:00:00.000Z',
    },
  ];
}

export function saveAdminAccounts(accounts) {
  try {
    localStorage.setItem('kui-admin-accounts', JSON.stringify(accounts));
  } catch {}
}

export function registerEditor({ fullName, username, password }) {
  const accounts = getAdminAccounts();
  const cleanUsername = username.trim().toLowerCase();
  if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
    throw new Error('Бұл логинмен әкімші тіркелген. Басқа логин таңдаңыз.');
  }
  const newAccount = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    username: cleanUsername,
    password: password.trim(),
    status: 'pending', // Requires Super Admin approval
    registeredAt: new Date().toISOString(),
  };
  accounts.push(newAccount);
  saveAdminAccounts(accounts);
  return newAccount;
}

export function approveEditorAccount(accountId) {
  const accounts = getAdminAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index >= 0) {
    accounts[index].status = 'approved';
    accounts[index].approvedAt = new Date().toISOString();
    saveAdminAccounts(accounts);
    return accounts[index];
  }
  throw new Error('Аккаунт табылмады.');
}

export function deleteEditorAccount(accountId) {
  const accounts = getAdminAccounts().filter((a) => a.id !== accountId);
  saveAdminAccounts(accounts);
  return accounts;
}

export function loginEditor({ username, password }) {
  const accounts = getAdminAccounts();
  const clean = (username || '').trim().toLowerCase();
  const account = accounts.find(
    (a) => a.username && a.username.toLowerCase() === clean && a.password === password.trim()
  );
  if (!account) {
    throw new Error('Логин немесе құпиясөз қате.');
  }
  if (account.status !== 'approved') {
    throw new Error('Сіздің тіркелу өтінішіңіз әлі қаралмады. Бас әкімшінің мақұлдауын күтіңіз.');
  }
  return account;
}

export function verifySuperAdmin(token) {
  if (!token) return false;
  return token.trim() === DEFAULT_SUPER_TOKEN;
}

export function bulkApprovePages(slugs, approverName = 'Бас әкімші') {
  const current = [...getLocalPages()];
  const now = new Date().toISOString();
  const updated = current.map((page) => {
    if (slugs.includes(page.slug)) {
      return {
        ...page,
        status: 'published',
        approved_by: approverName,
        approved_at: now,
      };
    }
    return page;
  });
  saveLocalPages(updated);
  return updated;
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
  const updated = {
    ...page,
    updated_at: new Date().toISOString(),
  };
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
  const created = {
    ...page,
    is_custom: true,
    updated_at: new Date().toISOString(),
  };
  current.push(created);
  saveLocalPages(current);
  return created;
}

export function resetLocalPages() {
  try {
    localStorage.removeItem('kui-custom-pages');
    localStorage.removeItem('kui-admin-accounts');
  } catch {}
  return defaultPages.map((p) => ({
    ...p,
    status: 'published',
    created_by: 'Бас әкімші',
    approved_by: 'Бас әкімші',
    approved_at: '2026-10-29T10:00:00.000Z',
    change_summary: 'Бастапқы нұсқа',
  }));
}
