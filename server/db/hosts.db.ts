import { pool } from './pool'
import type { IHost, IHostRow } from '../types'

const toHost = (row: IHostRow): IHost => ({
  userId: row.user_id,
  fullName: row.full_name,
  login: row.login,
  positionId: row.position_id,
  positionName: row.position_name,
  rank: row.rank,
  unitId: row.unit_id,
  unitName: row.unit_name,
  unitType: row.unit_type,
  unitPath: row.unit_path,
})

const TREE_SQL = `
  WITH RECURSIVE tree AS (
    SELECT id, name, type, parent_id, name::text AS path, 0 AS depth FROM units WHERE parent_id IS NULL
    UNION ALL
    SELECT u.id, u.name, u.type, u.parent_id, tree.path || ' / ' || u.name, tree.depth + 1
    FROM units u JOIN tree ON u.parent_id = tree.id
  )
  SELECT us.id AS user_id, us.full_name, us.login,
         p.id AS position_id, p.name AS position_name, p.rank,
         t.id AS unit_id, t.name AS unit_name, t.type AS unit_type, t.path AS unit_path
  FROM unit_positions up
  JOIN users us ON us.id = up.user_id AND us.is_active = true
  JOIN positions p ON p.id = up.position_id
  JOIN tree t ON t.id = up.unit_id`
const SEARCH_SQL = `${TREE_SQL} ORDER BY t.depth, t.path, p.rank NULLS LAST, us.full_name`
const FIND_SQL = `${TREE_SQL} WHERE us.id = $1 ORDER BY t.depth, p.rank NULLS LAST LIMIT 1`

export const hostsDb = {
  search: async () => (await pool.query<IHostRow>(SEARCH_SQL)).rows.map(toHost),
  findByUser: async (userId: string) => {
    const row = (await pool.query<IHostRow>(FIND_SQL, [userId])).rows[0]
    return row ? toHost(row) : null
  },
}
