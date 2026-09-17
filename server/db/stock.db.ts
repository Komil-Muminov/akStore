import { pool } from './pool'
import { StockMoveKind, type IStockMove, type IStockMoveRow } from '../types'

const toMove = (row: IStockMoveRow): IStockMove => ({
  id: row.id,
  productId: row.product_id,
  productName: row.product_name,
  kind: row.kind,
  quantity: Number(row.quantity),
  costPrice: Number(row.cost_price),
  note: row.note,
  authorName: row.author_name ?? '',
  createdAt: row.created_at.toISOString(),
})

const CREATE_SQL = `
  INSERT INTO stock_moves (product_id, kind, quantity, cost_price, note, author_id)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

const APPLY_SQL = 'UPDATE products SET stock = stock + $2, updated_at = now() WHERE id = $1 RETURNING stock'

const SET_COST_SQL = 'UPDATE products SET cost_price = $2, updated_at = now() WHERE id = $1'

const HISTORY_SQL = `
  SELECT m.id, m.product_id, p.name AS product_name, m.kind, m.quantity, m.cost_price,
         m.note, u.full_name AS author_name, m.created_at
  FROM stock_moves m
  JOIN products p ON p.id = m.product_id
  LEFT JOIN users u ON u.id = m.author_id
  WHERE ($1::uuid IS NULL OR m.product_id = $1)
  ORDER BY m.created_at DESC
  LIMIT $2`

export const stockDb = {
  register: async (
    productId: string,
    kind: StockMoveKind,
    quantity: number,
    costPrice: number,
    note: string,
    authorId: string,
  ) => {
    await pool.query(CREATE_SQL, [productId, kind, quantity, costPrice, note, authorId])
    const stock = (await pool.query<{ stock: string }>(APPLY_SQL, [productId, quantity])).rows[0]?.stock
    if (kind === StockMoveKind.INCOME && costPrice > 0) await pool.query(SET_COST_SQL, [productId, costPrice])
    return Number(stock ?? 0)
  },
  history: async (productId: string | null, limit: number) =>
    (await pool.query<IStockMoveRow>(HISTORY_SQL, [productId, limit])).rows.map(toMove),
}
