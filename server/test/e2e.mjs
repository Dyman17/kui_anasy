// End-to-end API check against a running server with a disposable database.
// Usage: API_URL=http://localhost:4000 node server/test/e2e.mjs [path/to/.env]
// Creates a test editor (deleted at the end) and a test page "test-page-tester*" (left in the DB); never point it at production.
import fs from 'node:fs';
const B = process.env.API_URL || 'http://localhost:4000';
const env = Object.fromEntries(fs.readFileSync(process.argv[2] || new URL('../../.env', import.meta.url), 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const j = async (method, path, body, token) => {
  const r = await fetch(B + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { s: r.status, b: await r.json().catch(() => null) };
};
const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
const u = 'tester' + Date.now() % 100000;
let r = await j('POST', '/api/auth/master', { token: 'wrong' }); ok(r.s === 401, 'wrong master 401');
r = await j('POST', '/api/auth/master', { token: env.ADMIN_TOKEN.trim() }); ok(r.s === 200 && r.b.token, 'master login'); const sup = r.b.token;
r = await j('POST', '/api/auth/register', { fullName: 'Тест Редактор', username: u, password: 'short' }); ok(r.s === 400, 'short password rejected');
r = await j('POST', '/api/auth/register', { fullName: 'Тест Редактор', username: u, password: 'longpassword1' }); ok(r.s === 201, 'register');
r = await j('POST', '/api/auth/login', { username: u, password: 'longpassword1' }); ok(r.s === 403, 'pending editor cannot login');
r = await j('GET', '/api/admin/editors', null, sup); const ed = r.b.find(e => e.username === u); ok(ed && !('password_hash' in ed), 'list editors, no hash leaked');
r = await j('POST', `/api/admin/editors/${ed.id}/approve`, null, sup); ok(r.s === 200, 'approve editor');
r = await j('POST', '/api/auth/login', { username: u, password: 'bad-password' }); ok(r.s === 401, 'bad password 401');
r = await j('POST', '/api/auth/login', { username: u, password: 'longpassword1' }); ok(r.s === 200, 'editor login'); const edt = r.b.token;
r = await j('GET', '/api/admin/editors', null, edt); ok(r.s === 403, 'editor cannot list editors');
const slug = 'test-page-' + u;
const page = { slug, title: 'Тест бет', description: 'd', position: 1, parent_slug: 'people', lang: 'kk', created_at: 'x', blocks: [{ id: 'b1', type: 'text', title: 'T', body: 'Мәтін' }] };
r = await j('POST', '/api/pages', page, edt); ok(r.s === 201 && r.b.status === 'pending' && r.b.created_by === 'Тест Редактор', 'editor create -> pending (extra fields stripped)');
r = await j('GET', '/api/pages'); ok(!r.b.some(p => p.slug === slug), 'pending hidden from public');
r = await j('POST', '/api/pages', { ...page, slug: slug + '-x', blocks: [{ id: 'b', type: 'callout', title: 't', body: '', link: 'javascript:alert(1)' }] }, edt); ok(r.s === 400, 'javascript: link rejected');
r = await j('POST', '/api/admin/pages/approve', { slugs: [slug] }, edt); ok(r.s === 403, 'editor cannot approve');
r = await j('POST', '/api/admin/pages/approve', { slugs: [slug] }, sup); ok(r.s === 200 && r.b[0]?.status === 'published', 'super approve');
r = await j('GET', '/api/pages'); ok(r.b.some(p => p.slug === slug), 'published visible');
r = await j('PUT', '/api/pages/' + slug, { ...page, title: 'Өзгертілген' }, edt); ok(r.s === 200 && r.b.pending_draft?.title === 'Өзгертілген' && r.b.title === 'Тест бет', 'editor edit of published -> draft');
r = await j('GET', '/api/pages'); ok(r.b.find(p => p.slug === slug).title === 'Тест бет' && !('pending_draft' in r.b.find(p => p.slug === slug)), 'public still sees old title, no draft field');
r = await j('POST', '/api/admin/pages/approve', { slugs: [slug] }, sup); ok(r.b[0]?.title === 'Өзгертілген' && r.b[0].pending_draft === null, 'approve applies draft');
r = await j('GET', '/api/admin/audit?target=' + slug, null, sup); ok(r.s === 200 && r.b.length >= 4, 'audit entries: ' + r.b.map(a => a.action).join(','));
r = await j('GET', '/api/admin/audit', null, edt); ok(r.s === 403, 'editor cannot read audit');
r = await j('POST', '/api/auth/logout', null, edt); r = await j('GET', '/api/auth/me', null, edt); ok(r.s === 401, 'logout invalidates session');
r = await j('DELETE', `/api/admin/editors/${ed.id}`, null, sup); ok(r.s === 200, 'delete editor');
