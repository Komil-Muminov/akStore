import { pool } from './pool'

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS passes_status_idx ON passes (status);
`

export const initDb = async () => {
  await pool.query(SCHEMA)
}
