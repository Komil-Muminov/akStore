import { pool } from './pool'
import type { IUnit, IUnitInput, IUnitRow } from '../types'

const toUnit = (row: IUnitRow): IUnit => ({
  id: row.id,
  name: row.name,
  type: row.type,
  parentId: row.parent_id,
  x: row.layout_x,
  y: row.layout_y,
  positionIds: row.position_ids ?? [],
  assignments: row.assignments ?? [],
})

const SELECT_SQL = `
  SELECT u.*, (
    SELECT array_agg(up.position_id ORDER BY up.sort_order)
    FROM unit_positions up WHERE up.unit_id = u.id
  ) AS position_ids, (
    SELECT json_agg(json_build_object('positionId', up.position_id, 'userId', up.user_id) ORDER BY up.sort_order)
    FROM unit_positions up WHERE up.unit_id = u.id
  ) AS assignments
  FROM units u`
const SEARCH_SQL = `${SELECT_SQL} ORDER BY u.sort_order, u.created_at`
const FIND_SQL = `${SELECT_SQL} WHERE u.id = $1`
const CREATE_SQL = `
  INSERT INTO units (name, type, parent_id, layout_x, layout_y)
  VALUES ($1, $2, $3, $4, $5) RETURNING id`
const UPDATE_SQL = 'UPDATE units SET name = $2, layout_x = $3, layout_y = $4 WHERE id = $1 RETURNING id'
const MOVE_SQL = 'UPDATE units SET parent_id = $2 WHERE id = $1 RETURNING id'
const LAYOUT_SQL = 'UPDATE units SET layout_x = $2, layout_y = $3 WHERE id = $1'
const DELETE_SQL = 'DELETE FROM units WHERE id = $1 RETURNING id'
const CHILDREN_SQL = 'SELECT count(*)::text AS total FROM units WHERE parent_id = $1'
const CLEAR_POSITIONS_SQL = 'DELETE FROM unit_positions WHERE unit_id = $1'
const ADD_POSITION_SQL = 'INSERT INTO unit_positions (unit_id, position_id, user_id, sort_order) VALUES ($1, $2, $3, $4)'

export const unitsDb = {
  search: async () => {
    const result = await pool.query<IUnitRow>(SEARCH_SQL)
    return result.rows.map(toUnit)
  },
  find: async (id: string) => {
    const result = await pool.query<IUnitRow>(FIND_SQL, [id])
    return result.rows[0] ? toUnit(result.rows[0]) : null
  },
  create: async (input: IUnitInput) => {
    const result = await pool.query<{ id: string }>(CREATE_SQL, [
      input.name,
      input.type,
      input.parentId,
      input.x,
      input.y,
    ])
    return result.rows[0]!.id
  },
  update: async (id: string, name: string, x: number, y: number) => {
    const result = await pool.query(UPDATE_SQL, [id, name, x, y])
    return (result.rowCount ?? 0) > 0
  },
  move: async (id: string, parentId: string | null) => {
    const result = await pool.query(MOVE_SQL, [id, parentId])
    return (result.rowCount ?? 0) > 0
  },
  setLayout: async (items: { id: string; x: number; y: number }[]) => {
    for (const item of items) {
      await pool.query(LAYOUT_SQL, [item.id, item.x, item.y])
    }
  },
  childrenCount: async (id: string) => {
    const result = await pool.query<{ total: string }>(CHILDREN_SQL, [id])
    return Number(result.rows[0]?.total ?? 0)
  },
  setPositions: async (id: string, assignments: { positionId: string; userId: string | null }[]) => {
    await pool.query(CLEAR_POSITIONS_SQL, [id])
    for (let index = 0; index < assignments.length; index++) {
      const item = assignments[index]!
      await pool.query(ADD_POSITION_SQL, [id, item.positionId, item.userId, index])
    }
  },
  remove: async (id: string) => {
    const result = await pool.query(DELETE_SQL, [id])
    return (result.rowCount ?? 0) > 0
  },
}
