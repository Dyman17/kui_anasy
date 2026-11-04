import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const SCRYPT_KEYLEN = 64;

export const ROLES = { SUPER: 'SUPER_ADMIN', EDITOR: 'EDITOR' };

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest();
}

/** Constant-time comparison for strings of any length. */
export function safeEqual(a, b) {
  return crypto.timingSafeEqual(sha256(a), sha256(b));
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, saltB64, hashB64] = String(stored || '').split('$');
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

export async function createSession(pool, { role, userId = null, fullName }) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await pool.query(
    `INSERT INTO admin_sessions (token_hash, role, user_id, full_name, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [sha256(token).toString('hex'), role, userId, fullName, expiresAt],
  );
  return { token, expiresAt: expiresAt.toISOString() };
}

export async function destroySession(pool, token) {
  if (!token) return;
  await pool.query('DELETE FROM admin_sessions WHERE token_hash = $1', [sha256(token).toString('hex')]);
}

function readBearer(req) {
  const header = req.get('Authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

/**
 * Resolves the caller from a session token (Authorization: Bearer) or,
 * for scripts/backward compatibility, the raw master key in X-Admin-Token.
 */
export function authenticate(pool, masterToken) {
  return async (req, _res, next) => {
    req.actor = null;
    try {
      const legacy = req.get('X-Admin-Token');
      if (legacy && safeEqual(legacy, masterToken)) {
        req.actor = { role: ROLES.SUPER, fullName: 'Бас әкімші', userId: null };
        return next();
      }
      const token = readBearer(req);
      if (!token) return next();
      const result = await pool.query(
        `SELECT s.role, s.user_id, s.full_name, u.status AS user_status
         FROM admin_sessions s
         LEFT JOIN admin_users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
        [sha256(token).toString('hex')],
      );
      const row = result.rows[0];
      if (!row) return next();
      if (row.role === ROLES.EDITOR && row.user_status !== 'approved') return next();
      req.actor = { role: row.role, fullName: row.full_name, userId: row.user_id, token };
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireAuth(req, res, next) {
  if (!req.actor) return res.status(401).json({ error: 'Жүйеге кіру қажет немесе сессия мерзімі өтті.' });
  return next();
}

export function requireSuper(req, res, next) {
  if (!req.actor) return res.status(401).json({ error: 'Жүйеге кіру қажет немесе сессия мерзімі өтті.' });
  if (req.actor.role !== ROLES.SUPER) return res.status(403).json({ error: 'Бұл әрекет тек Бас әкімшіге рұқсат етілген.' });
  return next();
}

/** Simple in-memory limiter for failed login attempts per IP. */
export function createLoginLimiter({ max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const attempts = new Map();
  return {
    isBlocked(ip) {
      const entry = attempts.get(ip);
      if (!entry) return false;
      if (entry.resetAt < Date.now()) {
        attempts.delete(ip);
        return false;
      }
      return entry.count >= max;
    },
    fail(ip) {
      const entry = attempts.get(ip);
      if (!entry || entry.resetAt < Date.now()) attempts.set(ip, { count: 1, resetAt: Date.now() + windowMs });
      else entry.count += 1;
    },
    reset(ip) {
      attempts.delete(ip);
    },
  };
}
