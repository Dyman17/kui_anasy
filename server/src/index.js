import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import { z } from 'zod';
import { defaultPages } from './defaultPages.js';
import {
  ROLES,
  authenticate,
  createLoginLimiter,
  createSession,
  destroySession,
  hashPassword,
  requireAuth,
  requireSuper,
  safeEqual,
  verifyPassword,
} from './auth.js';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const { Pool } = pg;
const { DATABASE_URL, ADMIN_TOKEN } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is required. Configure a PostgreSQL database before starting the API.');
if (!ADMIN_TOKEN || ADMIN_TOKEN.length < 24) {
  throw new Error('ADMIN_TOKEN must be set to a secret of at least 24 characters before starting the API.');
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
/**
 * SSL: DATABASE_SSL=true forces TLS, =false disables it. When unset, TLS is used for any
 * non-local host (managed Postgres such as Neon/Render requires it) and skipped for localhost.
 */
function sslConfig() {
  if (process.env.DATABASE_SSL === 'true') return { rejectUnauthorized: false };
  if (process.env.DATABASE_SSL === 'false') return false;
  const host = new URL(DATABASE_URL).hostname;
  return ['localhost', '127.0.0.1', '::1'].includes(host) ? false : { rejectUnauthorized: false };
}

const IS_SERVERLESS = Boolean(process.env.VERCEL);
const pool = new Pool({ connectionString: DATABASE_URL, ssl: sslConfig(), max: IS_SERVERLESS ? 3 : 10 });
const app = express();
const port = Number(process.env.PORT) || 4000;
const loginLimiter = createLoginLimiter();

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Links in content may be site-relative ("/x", "#x") or absolute http(s). Blocks javascript:, data: etc. */
function isSafeLink(value) {
  if (!value) return true;
  const link = String(value).trim();
  if (link.startsWith('/') && !link.startsWith('//')) return true;
  if (link.startsWith('#')) return true;
  try {
    return ['http:', 'https:'].includes(new URL(link).protocol);
  } catch {
    return false;
  }
}

const contentBlockSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(['heading', 'text', 'feature', 'quote', 'image', 'list', 'stats', 'cards', 'callout', 'qr']),
  title: z.string().max(300).default(''),
  body: z.string().max(12000).default(''),
  eyebrow: z.string().max(200).optional(),
  items: z.array(z.record(z.string(), z.unknown())).max(100).optional(),
  link: z.string().max(2000).optional(),
  linkLabel: z.string().max(200).optional(),
})
  .refine((block) => isSafeLink(block.link), {
    message: 'Сілтеме тек http(s):// немесе сайт ішіндегі /... түрінде болуы керек.',
    path: ['link'],
  })
  .refine(
    (block) => {
      if (block.type !== 'qr') return true;
      try {
        return ['http:', 'https:'].includes(new URL(block.link).protocol);
      } catch {
        return false;
      }
    },
    { message: 'QR кодқа жарамды HTTP немесе HTTPS сілтемесін енгізіңіз.', path: ['link'] },
  );

// Unknown keys (lang, created_at, updated_at…) are stripped instead of rejected.
// Authorship and moderation fields are always set by the server, never trusted from the client.
const pageSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(''),
  position: z.number().int().min(0).max(1000).default(0),
  parent_slug: z.string().max(80).optional().default(''),
  change_summary: z.string().max(1000).optional().default(''),
  blocks: z.array(contentBlockSchema).max(100),
});

const credentialsSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(40).regex(/^[a-z0-9._-]+$/, 'Логин тек латын әріптері, сандар және . _ - таңбаларынан тұруы керек.'),
  password: z.string().min(8, 'Құпиясөз кемінде 8 таңба болуы керек.').max(200),
});
const registerSchema = credentialsSchema.extend({
  fullName: z.string().trim().min(2).max(150),
});
const slugListSchema = z.object({ slugs: z.array(z.string().min(1).max(80)).min(1).max(200) });

const PAGE_COLUMNS = `slug, title, description, position, parent_slug, status, created_by, approved_by, approved_at,
  change_summary, blocks, is_custom, updated_at`;
const ADMIN_PAGE_COLUMNS = `${PAGE_COLUMNS}, pending_draft, pending_by, pending_at`;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.disable('x-powered-by');
// Vercel and Nginx both sit in front of the app; trust their X-Forwarded-For for rate limiting.
app.set('trust proxy', IS_SERVERLESS ? true : 'loopback');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by the API CORS policy.'));
  },
}));
app.use(express.json({ limit: '1mb' }));

// Schema migrations run once per process (per cold start on Vercel) before any request is served.
let ready = null;
app.use((_req, _res, next) => {
  ready ??= migrate().catch((error) => {
    ready = null; // allow the next request to retry
    throw error;
  });
  ready.then(() => next(), next);
});
app.use(authenticate(pool, ADMIN_TOKEN));

function handleError(error, res) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.issues[0]?.message || 'Деректер дұрыс толтырылмаған.', details: error.issues });
  }
  console.error(error);
  return res.status(500).json({ error: 'Сервер қатесі орын алды.' });
}

async function audit(client, actor, action, target, summary = '', details = null) {
  await client.query(
    `INSERT INTO audit_log (actor, role, action, target, summary, details) VALUES ($1, $2, $3, $4, $5, $6)`,
    [actor?.fullName || 'Жүйе', actor?.role || '', action, target || '', summary, details ? JSON.stringify(details) : null],
  );
}

async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', error: 'Database is unavailable.' });
  }
});

/** Public readers only ever see published content; drafts awaiting moderation stay hidden. */
app.get('/api/pages', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${PAGE_COLUMNS} FROM content_pages WHERE status = 'published' ORDER BY position, title`,
    );
    res.json(result.rows);
  } catch (error) {
    handleError(error, res);
  }
});

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

function tooManyAttempts(req, res) {
  if (!loginLimiter.isBlocked(req.ip)) return false;
  res.status(429).json({ error: 'Тым көп сәтсіз әрекет. 15 минуттан кейін қайталап көріңіз.' });
  return true;
}

app.post('/api/auth/master', async (req, res) => {
  try {
    if (tooManyAttempts(req, res)) return;
    const token = String(req.body?.token || '');
    if (!token || !safeEqual(token, ADMIN_TOKEN)) {
      loginLimiter.fail(req.ip);
      return res.status(401).json({ error: 'Құпия кілт қате. Қайта тексеріп көріңіз.' });
    }
    loginLimiter.reset(req.ip);
    const session = await createSession(pool, { role: ROLES.SUPER, fullName: 'Бас әкімші' });
    await audit(pool, { fullName: 'Бас әкімші', role: ROLES.SUPER }, 'auth.login', 'Бас әкімші');
    res.json({ ...session, user: { role: ROLES.SUPER, fullName: 'Бас әкімші' } });
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(data.password);
    const result = await pool.query(
      `INSERT INTO admin_users (full_name, username, password_hash) VALUES ($1, $2, $3)
       RETURNING id, full_name, username, status, created_at`,
      [data.fullName, data.username, passwordHash],
    );
    await audit(pool, { fullName: data.fullName, role: ROLES.EDITOR }, 'editor.register', data.username, 'Тіркелуге өтініш');
    res.status(201).json({ status: result.rows[0].status });
  } catch (error) {
    if (error?.code === '23505') return res.status(409).json({ error: 'Бұл логинмен редактор тіркелген. Басқа логин таңдаңыз.' });
    handleError(error, res);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (tooManyAttempts(req, res)) return;
    const data = credentialsSchema.parse(req.body);
    const result = await pool.query('SELECT id, full_name, password_hash, status FROM admin_users WHERE username = $1', [data.username]);
    const user = result.rows[0];
    const valid = user ? await verifyPassword(data.password, user.password_hash) : false;
    if (!valid) {
      loginLimiter.fail(req.ip);
      return res.status(401).json({ error: 'Логин немесе құпиясөз қате.' });
    }
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Тіркелу өтінішіңіз әлі қаралмады. Бас әкімшінің мақұлдауын күтіңіз.' });
    }
    loginLimiter.reset(req.ip);
    const session = await createSession(pool, { role: ROLES.EDITOR, userId: user.id, fullName: user.full_name });
    await audit(pool, { fullName: user.full_name, role: ROLES.EDITOR }, 'auth.login', data.username);
    res.json({ ...session, user: { role: ROLES.EDITOR, fullName: user.full_name, username: data.username, id: user.id } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(401).json({ error: 'Логин немесе құпиясөз қате.' });
    handleError(error, res);
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: { role: req.actor.role, fullName: req.actor.fullName, id: req.actor.userId } });
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    await destroySession(pool, req.actor?.token);
    res.json({ ok: true });
  } catch (error) {
    handleError(error, res);
  }
});

// ---------------------------------------------------------------------------
// Editors management (Super Admin)
// ---------------------------------------------------------------------------

app.get('/api/admin/editors', requireSuper, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, username, status, created_at, approved_at, approved_by FROM admin_users ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/api/admin/editors/:id/approve', requireSuper, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE admin_users SET status = 'approved', approved_at = NOW(), approved_by = $2
       WHERE id = $1 RETURNING id, full_name, username, status, created_at, approved_at, approved_by`,
      [req.params.id, req.actor.fullName],
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Аккаунт табылмады.' });
    await audit(pool, req.actor, 'editor.approve', result.rows[0].username, result.rows[0].full_name);
    res.json(result.rows[0]);
  } catch (error) {
    if (error?.code === '22P02') return res.status(404).json({ error: 'Аккаунт табылмады.' });
    handleError(error, res);
  }
});

app.delete('/api/admin/editors/:id', requireSuper, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM admin_users WHERE id = $1 RETURNING username, full_name', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Аккаунт табылмады.' });
    await audit(pool, req.actor, 'editor.delete', result.rows[0].username, result.rows[0].full_name);
    res.json({ ok: true });
  } catch (error) {
    if (error?.code === '22P02') return res.status(404).json({ error: 'Аккаунт табылмады.' });
    handleError(error, res);
  }
});

// ---------------------------------------------------------------------------
// Pages with moderation
// ---------------------------------------------------------------------------

app.get('/api/admin/pages', requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(`SELECT ${ADMIN_PAGE_COLUMNS} FROM content_pages ORDER BY position, title`);
    res.json(result.rows);
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/api/pages', requireAuth, async (req, res) => {
  try {
    const page = pageSchema.parse(req.body);
    const isSuper = req.actor.role === ROLES.SUPER;
    const row = await withTransaction(async (client) => {
      const result = await client.query(
        `INSERT INTO content_pages (slug, title, description, position, parent_slug, status, created_by, approved_by, approved_at, change_summary, blocks, is_custom)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, TRUE)
         RETURNING ${ADMIN_PAGE_COLUMNS}`,
        [
          page.slug, page.title, page.description, page.position, page.parent_slug || '',
          isSuper ? 'published' : 'pending',
          req.actor.fullName,
          isSuper ? req.actor.fullName : '',
          isSuper ? new Date().toISOString() : '',
          page.change_summary || 'Жаңадан жасалған бет',
          JSON.stringify(page.blocks),
        ],
      );
      await audit(client, req.actor, isSuper ? 'page.create.publish' : 'page.create.submit', page.slug, page.change_summary || page.title);
      return result.rows[0];
    });
    res.status(201).json(row);
  } catch (error) {
    if (error?.code === '23505') return res.status(409).json({ error: 'Мұндай сілтемесі бар бөлім бар.' });
    handleError(error, res);
  }
});

/**
 * Super Admin edits publish immediately. Editor edits of a published page are stored
 * as pending_draft and stay invisible to readers until a Super Admin approves them.
 */
app.put('/api/pages/:slug', requireAuth, async (req, res) => {
  try {
    const page = pageSchema.parse(req.body);
    if (page.slug !== req.params.slug) return res.status(400).json({ error: 'Бөлім сілтемесі сәйкес келмейді.' });
    const isSuper = req.actor.role === ROLES.SUPER;
    const summary = page.change_summary || 'Мәтін мен модульдер жаңартылды';

    const row = await withTransaction(async (client) => {
      const current = await client.query(
        `SELECT title, description, parent_slug, blocks, status FROM content_pages WHERE slug = $1 FOR UPDATE`,
        [page.slug],
      );
      if (!current.rowCount) return null;
      const before = current.rows[0];

      let result;
      if (isSuper) {
        result = await client.query(
          `UPDATE content_pages
           SET title = $2, description = $3, position = $4, parent_slug = $5, status = 'published',
               approved_by = $6, approved_at = NOW()::text, change_summary = $7, blocks = $8::jsonb,
               pending_draft = NULL, pending_by = '', pending_at = NULL, updated_at = NOW()
           WHERE slug = $1 RETURNING ${ADMIN_PAGE_COLUMNS}`,
          [page.slug, page.title, page.description, page.position, page.parent_slug || '', req.actor.fullName, summary, JSON.stringify(page.blocks)],
        );
      } else if (before.status !== 'published') {
        // Never-published page: the editor keeps working on the pending row itself.
        result = await client.query(
          `UPDATE content_pages
           SET title = $2, description = $3, position = $4, parent_slug = $5, status = 'pending',
               change_summary = $6, blocks = $7::jsonb, updated_at = NOW()
           WHERE slug = $1 RETURNING ${ADMIN_PAGE_COLUMNS}`,
          [page.slug, page.title, page.description, page.position, page.parent_slug || '', summary, JSON.stringify(page.blocks)],
        );
      } else {
        const draft = {
          title: page.title,
          description: page.description,
          position: page.position,
          parent_slug: page.parent_slug || '',
          change_summary: summary,
          blocks: page.blocks,
        };
        result = await client.query(
          `UPDATE content_pages SET pending_draft = $2::jsonb, pending_by = $3, pending_at = NOW()
           WHERE slug = $1 RETURNING ${ADMIN_PAGE_COLUMNS}`,
          [page.slug, JSON.stringify(draft), req.actor.fullName],
        );
      }
      await audit(client, req.actor, isSuper ? 'page.update.publish' : 'page.update.submit', page.slug, summary, {
        before: { title: before.title, description: before.description, parent_slug: before.parent_slug, blocks: before.blocks },
        after: { title: page.title, description: page.description, parent_slug: page.parent_slug, blocks: page.blocks },
      });
      return result.rows[0];
    });
    if (!row) return res.status(404).json({ error: 'Бөлім табылмады.' });
    res.json(row);
  } catch (error) {
    handleError(error, res);
  }
});

/** Bulk approve: publishes pending pages and applies pending drafts in one transaction. */
app.post('/api/admin/pages/approve', requireSuper, async (req, res) => {
  try {
    const { slugs } = slugListSchema.parse(req.body);
    const rows = await withTransaction(async (client) => {
      const approved = [];
      for (const slug of slugs) {
        const result = await client.query(
          `UPDATE content_pages SET
             title = COALESCE(pending_draft->>'title', title),
             description = COALESCE(pending_draft->>'description', description),
             position = COALESCE((pending_draft->>'position')::int, position),
             parent_slug = COALESCE(pending_draft->>'parent_slug', parent_slug),
             change_summary = COALESCE(pending_draft->>'change_summary', change_summary),
             blocks = COALESCE(pending_draft->'blocks', blocks),
             status = 'published', approved_by = $2, approved_at = NOW()::text,
             pending_draft = NULL, pending_by = '', pending_at = NULL, updated_at = NOW()
           WHERE slug = $1 AND (status <> 'published' OR pending_draft IS NOT NULL)
           RETURNING ${ADMIN_PAGE_COLUMNS}`,
          [slug, req.actor.fullName],
        );
        if (result.rowCount) {
          approved.push(result.rows[0]);
          await audit(client, req.actor, 'page.approve', slug, result.rows[0].change_summary);
        }
      }
      if (slugs.length > 1) await audit(client, req.actor, 'page.bulk_approve', '', `${approved.length} бет бекітілді`, { slugs: approved.map((p) => p.slug) });
      return approved;
    });
    res.json(rows);
  } catch (error) {
    handleError(error, res);
  }
});

app.post('/api/admin/pages/:slug/reject', requireSuper, async (req, res) => {
  try {
    const reason = String(req.body?.reason || '').slice(0, 1000);
    const row = await withTransaction(async (client) => {
      const result = await client.query(
        `UPDATE content_pages SET
           status = CASE WHEN status = 'published' THEN 'published' ELSE 'rejected' END,
           pending_draft = NULL, pending_by = '', pending_at = NULL, updated_at = NOW()
         WHERE slug = $1 RETURNING ${ADMIN_PAGE_COLUMNS}`,
        [req.params.slug],
      );
      if (!result.rowCount) return null;
      await audit(client, req.actor, 'page.reject', req.params.slug, reason);
      return result.rows[0];
    });
    if (!row) return res.status(404).json({ error: 'Бөлім табылмады.' });
    res.json(row);
  } catch (error) {
    handleError(error, res);
  }
});

app.get('/api/admin/audit', requireSuper, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const before = Number(req.query.before) || null;
    const target = req.query.target ? String(req.query.target) : null;
    const result = await pool.query(
      `SELECT id, at, actor, role, action, target, summary, details
       FROM audit_log
       WHERE ($1::bigint IS NULL OR id < $1) AND ($2::text IS NULL OR target = $2)
       ORDER BY id DESC LIMIT $3`,
      [before, target, limit],
    );
    res.json(result.rows);
  } catch (error) {
    handleError(error, res);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Сервер сұрауды өңдей алмады.' });
});

// ---------------------------------------------------------------------------
// Schema & startup
// ---------------------------------------------------------------------------

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_pages (
      slug text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      position integer NOT NULL DEFAULT 0,
      parent_slug text NOT NULL DEFAULT '',
      status text NOT NULL DEFAULT 'published',
      created_by text NOT NULL DEFAULT '',
      approved_by text NOT NULL DEFAULT '',
      approved_at text NOT NULL DEFAULT '',
      change_summary text NOT NULL DEFAULT '',
      blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
      is_custom boolean NOT NULL DEFAULT false,
      updated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `);
  const pageColumns = [
    ['is_custom', 'boolean NOT NULL DEFAULT false'],
    ['parent_slug', "text NOT NULL DEFAULT ''"],
    ['status', "text NOT NULL DEFAULT 'published'"],
    ['created_by', "text NOT NULL DEFAULT ''"],
    ['approved_by', "text NOT NULL DEFAULT ''"],
    ['approved_at', "text NOT NULL DEFAULT ''"],
    ['change_summary', "text NOT NULL DEFAULT ''"],
    ['pending_draft', 'jsonb'],
    ['pending_by', "text NOT NULL DEFAULT ''"],
    ['pending_at', 'timestamptz'],
  ];
  for (const [name, definition] of pageColumns) {
    await pool.query(`ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS ${name} ${definition}`);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name text NOT NULL,
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT NOW(),
      approved_at timestamptz,
      approved_by text NOT NULL DEFAULT ''
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash text PRIMARY KEY,
      role text NOT NULL,
      user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
      full_name text NOT NULL,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id bigserial PRIMARY KEY,
      at timestamptz NOT NULL DEFAULT NOW(),
      actor text NOT NULL DEFAULT '',
      role text NOT NULL DEFAULT '',
      action text NOT NULL,
      target text NOT NULL DEFAULT '',
      summary text NOT NULL DEFAULT '',
      details jsonb
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS audit_log_target_idx ON audit_log (target)');
  await pool.query('DELETE FROM admin_sessions WHERE expires_at < NOW()');

  for (const page of defaultPages) {
    await pool.query(
      `INSERT INTO content_pages (slug, title, description, position, parent_slug, status, created_by, approved_by, approved_at, change_summary, blocks)
       VALUES ($1, $2, $3, $4, $5, 'published', 'Бас әкімші', 'Бас әкімші', NOW()::text, 'Бастапқы нұсқа', $6::jsonb)
       ON CONFLICT (slug) DO NOTHING`,
      [page.slug, page.title, page.description, page.position, page.parent_slug || '', JSON.stringify(page.blocks)],
    );
  }
}

// On Vercel the platform imports the app as a function; elsewhere (local, VPS) we listen ourselves.
if (!IS_SERVERLESS) {
  setInterval(() => {
    pool.query('DELETE FROM admin_sessions WHERE expires_at < NOW()').catch((error) => console.error('Session cleanup failed:', error));
  }, 60 * 60 * 1000).unref();
  app.listen(port, '0.0.0.0', () => console.log(`Kui Anasy API listening on port ${port}`));
}

export default app;
