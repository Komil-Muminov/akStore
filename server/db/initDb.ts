import pg from 'pg'
import { config } from '../config'
import { pool } from './pool'

const MAINTENANCE_DB = 'postgres'
const DB_NAME_PATTERN = /^[a-z_][a-z0-9_]*$/

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS host_name TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS organization TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS car_plate TEXT NOT NULL DEFAULT '';
  ALTER TABLE passes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  CREATE INDEX IF NOT EXISTS passes_status_idx ON passes (status);
`

const ensureDatabase = async () => {
  if (!DB_NAME_PATTERN.test(config.db.database)) {
    throw new Error(`Недопустимое имя базы данных: ${config.db.database}`)
  }
  const client = new pg.Client({ ...config.db, database: MAINTENANCE_DB })
  await client.connect()
  try {
    const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [config.db.database])
    if (existing.rowCount === 0) {
      await client.query(`CREATE DATABASE ${config.db.database}`)
      console.log(`db: создана база ${config.db.database}`)
    }
  } finally {
    await client.end()
  }
}

export const initDb = async () => {
  await ensureDatabase()
  await pool.query(SCHEMA)
}
