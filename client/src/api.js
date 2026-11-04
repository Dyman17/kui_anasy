import { defaultPages } from './defaultPages.js';

/**
 * VITE_API_URL:
 *   - "http://localhost:4000" or "https://api.example.kz" → cross-origin API;
 *   - "/" → same-origin API behind Nginx (VPS deployment);
 *   - empty / unset → offline demo: the public site reads bundled default pages,
 *     the admin panel is unavailable (there is no secure way to authenticate without a server).
 */
const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim();
export const API_ENABLED = RAW_API_URL !== '';
const API_URL = RAW_API_URL.replace(/\/$/, '');

const OFFLINE_ERROR = 'Сервер (API) қосылмаған. Әкімші панелі тек сервермен жұмыс істейді.';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  if (!API_ENABLED) throw new ApiError(OFFLINE_ERROR, 0);
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Серверге қосылу мүмкін болмады. Интернетті тексеріп, қайталап көріңіз.', 0);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(result.error || 'Сұрауды орындау мүмкін болмады.', response.status);
  return result;
}

function bundledPages() {
  return defaultPages.map((p) => ({ ...p, status: 'published' }));
}

// ---------------------------------------------------------------------------
// Public content
// ---------------------------------------------------------------------------

export async function getPages() {
  if (!API_ENABLED) return bundledPages();
  try {
    return await request('/api/pages');
  } catch (err) {
    console.warn('API connection failed, falling back to bundled pages:', err);
    return bundledPages();
  }
}

// ---------------------------------------------------------------------------
// Authentication — the master key and editor passwords are verified only on the server.
// ---------------------------------------------------------------------------

export async function loginSuperAdmin(masterToken) {
  const { token, expiresAt, user } = await request('/api/auth/master', { method: 'POST', body: { token: masterToken.trim() } });
  return { ...user, token, expiresAt };
}

export async function loginEditor({ username, password }) {
  const { token, expiresAt, user } = await request('/api/auth/login', { method: 'POST', body: { username, password } });
  return { ...user, token, expiresAt };
}

export function registerEditor({ fullName, username, password }) {
  return request('/api/auth/register', { method: 'POST', body: { fullName, username, password } });
}

export function getSessionUser(token) {
  return request('/api/auth/me', { token });
}

export async function logoutSession(token) {
  if (!token || !API_ENABLED) return;
  try {
    await request('/api/auth/logout', { method: 'POST', token });
  } catch {
    // Session expiry on the server is enough if the network call fails.
  }
}

// ---------------------------------------------------------------------------
// Admin: pages & moderation
// ---------------------------------------------------------------------------

/** All pages including pending ones and editors' drafts. */
export function getAdminPages(token) {
  return request('/api/admin/pages', { token });
}

export function savePage(page, token) {
  return request(`/api/pages/${encodeURIComponent(page.slug)}`, { method: 'PUT', body: page, token });
}

export function createPage(page, token) {
  return request('/api/pages', { method: 'POST', body: page, token });
}

export function approvePages(slugs, token) {
  return request('/api/admin/pages/approve', { method: 'POST', body: { slugs }, token });
}

export function rejectPage(slug, reason, token) {
  return request(`/api/admin/pages/${encodeURIComponent(slug)}/reject`, { method: 'POST', body: { reason }, token });
}

export function getAuditLog(token, { before, target, limit = 100 } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set('before', String(before));
  if (target) params.set('target', target);
  return request(`/api/admin/audit?${params}`, { token });
}

// ---------------------------------------------------------------------------
// Admin: editors (Super Admin only)
// ---------------------------------------------------------------------------

export function getEditors(token) {
  return request('/api/admin/editors', { token });
}

export function approveEditor(id, token) {
  return request(`/api/admin/editors/${encodeURIComponent(id)}/approve`, { method: 'POST', token });
}

export function deleteEditor(id, token) {
  return request(`/api/admin/editors/${encodeURIComponent(id)}`, { method: 'DELETE', token });
}
