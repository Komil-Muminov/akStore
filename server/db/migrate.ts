import { pool } from './pool'

const FIRST_OUTLET_SQL = 'SELECT id FROM outlets WHERE is_active ORDER BY created_at LIMIT 1'

const SALES_SQL = 'UPDATE sales SET outlet_id = $1 WHERE outlet_id IS NULL'
const SHIFTS_SQL = 'UPDATE shifts SET outlet_id = $1 WHERE outlet_id IS NULL'
const MOVES_SQL = 'UPDATE stock_moves SET outlet_id = $1 WHERE outlet_id IS NULL'

const STOCKS_SQL = `
  INSERT INTO product_stocks (product_id, outlet_id, quantity)
  SELECT p.id, $1, p.stock
  FROM products p
  WHERE p.stock <> 0
    AND NOT EXISTS (SELECT 1 FROM product_stocks s WHERE s.product_id = p.id)
  ON CONFLICT (product_id, outlet_id) DO NOTHING`

export const migrateOutlets = async () => {
  const outletId = (await pool.query<{ id: string }>(FIRST_OUTLET_SQL)).rows[0]?.id
  if (!outletId) return
  const moved = await pool.query(STOCKS_SQL, [outletId])
  const sales = await pool.query(SALES_SQL, [outletId])
  await pool.query(SHIFTS_SQL, [outletId])
  await pool.query(MOVES_SQL, [outletId])
  const stocked = moved.rowCount ?? 0
  const attached = sales.rowCount ?? 0
  if (stocked > 0 || attached > 0) {
    console.log(`db: перенесено остатков ${stocked}, привязано чеков ${attached}`)
  }
}
