import { pool } from './pool'
import type { IFiscalTaskRow } from '../types'

const ENQUEUE_SQL = `
  INSERT INTO fiscal_queue (sale_id, kind, last_error, next_try_at)
  VALUES ($1, $2, $3, now())
  ON CONFLICT (sale_id, kind) WHERE done_at IS NULL
  DO UPDATE SET last_error = EXCLUDED.last_error
  RETURNING id`

const DUE_SQL = `
  SELECT id, sale_id, kind, attempts, last_error
  FROM fiscal_queue
  WHERE done_at IS NULL AND next_try_at <= now()
  ORDER BY created_at LIMIT $1`

const DEFER_SQL = `
  UPDATE fiscal_queue
  SET attempts = attempts + 1, last_error = $2, next_try_at = now() + make_interval(secs => $3)
  WHERE id = $1`

const DONE_SQL = "UPDATE fiscal_queue SET done_at = now(), last_error = '' WHERE id = $1"

const PENDING_SQL = 'SELECT count(*)::text AS total FROM fiscal_queue WHERE done_at IS NULL'

export const fiscalDb = {
  enqueue: async (saleId: string, kind: string, error: string) => {
    await pool.query(ENQUEUE_SQL, [saleId, kind, error])
  },
  due: async (limit: number) => (await pool.query<IFiscalTaskRow>(DUE_SQL, [limit])).rows,
  defer: async (id: string, error: string, delaySeconds: number) => {
    await pool.query(DEFER_SQL, [id, error, delaySeconds])
  },
  done: async (id: string) => {
    await pool.query(DONE_SQL, [id])
  },
  pending: async () => Number((await pool.query<{ total: string }>(PENDING_SQL)).rows[0]?.total ?? 0),
}
