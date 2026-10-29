import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import { z } from 'zod';
import { defaultPages } from './defaultPages.js';

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
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});
const app = express();
const port = Number(process.env.PORT) || 4000;

const contentBlockSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(['heading', 'text', 'feature', 'quote', 'image', 'list', 'stats', 'cards', 'callout', 'qr']),
  title: z.string().max(300).default(''),
  body: z.string().max(12000).default(''),
  eyebrow: z.string().max(200).optional(),
  items: z.array(z.record(z.string(), z.unknown())).max(100).optional(),
  link: z.string().max(2000).optional(),
  linkLabel: z.string().max(200).optional(),
}).strict().refine(
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
const pageSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(''),
  position: z.number().int().min(0).max(1000),
  blocks: z.array(contentBlockSchema).max(100),
}).strict();

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by the API CORS policy.'));
  },
}));
app.use(express.json({ limit: '1mb' }));

function requireAdmin(req, res, next) {
  const provided = req.get('X-Admin-Token') || '';
  const expectedBuffer = Buffer.from(ADMIN_TOKEN);
  const providedBuffer = Buffer.from(provided);
  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return res.status(401).json({ error: 'Әкімші кілті дұрыс емес.' });
  }
  return next();
}

function handleValidation(error, res) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: 'Деректер дұрыс толтырылмаған.', details: error.issues });
  }
  console.error(error);
  return res.status(500).json({ error: 'Сервер қатесі орын алды.' });
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', error: 'Database is unavailable.' });
  }
});

app.get('/api/pages', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT slug, title, description, position, blocks, is_custom, updated_at FROM content_pages ORDER BY position, title',
    );
    res.json(result.rows);
  } catch (error) {
    handleValidation(error, res);
  }
});

app.post('/api/pages', requireAdmin, async (req, res) => {
  try {
    const page = pageSchema.parse(req.body);
    const result = await pool.query(
      `INSERT INTO content_pages (slug, title, description, position, blocks, is_custom)
       VALUES ($1, $2, $3, $4, $5::jsonb, TRUE)
       RETURNING slug, title, description, position, blocks, is_custom, updated_at`,
      [page.slug, page.title, page.description, page.position, JSON.stringify(page.blocks)],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error?.code === '23505') return res.status(409).json({ error: 'Мұндай сілтемесі бар бөлім бар.' });
    handleValidation(error, res);
  }
});

app.put('/api/pages/:slug', requireAdmin, async (req, res) => {
  try {
    const page = pageSchema.parse(req.body);
    if (page.slug !== req.params.slug) {
      return res.status(400).json({ error: 'Бөлім сілтемесі сәйкес келмейді.' });
    }
    const result = await pool.query(
      `UPDATE content_pages
       SET title = $2, description = $3, position = $4, blocks = $5::jsonb, updated_at = NOW()
       WHERE slug = $1
       RETURNING slug, title, description, position, blocks, is_custom, updated_at`,
      [page.slug, page.title, page.description, page.position, JSON.stringify(page.blocks)],
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Бөлім табылмады.' });
    res.json(result.rows[0]);
  } catch (error) {
    handleValidation(error, res);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Сервер сұрауды өңдей алмады.' });
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_pages (
      slug text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      position integer NOT NULL DEFAULT 0,
      blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
      is_custom boolean NOT NULL DEFAULT false,
      updated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query('ALTER TABLE content_pages ADD COLUMN IF NOT EXISTS is_custom boolean NOT NULL DEFAULT false');
  const existing = await pool.query('SELECT COUNT(*)::int AS count FROM content_pages');
  if (existing.rows[0].count === 0) {
    for (const page of defaultPages) {
      await pool.query(
        `INSERT INTO content_pages (slug, title, description, position, blocks)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [page.slug, page.title, page.description, page.position, JSON.stringify(page.blocks)],
      );
    }
  }
  app.listen(port, '0.0.0.0', () => console.log(`Kui Anasy API listening on port ${port}`));
}

start().catch((error) => {
  console.error('API startup failed:', error);
  process.exitCode = 1;
});
