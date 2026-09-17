import { pool } from './pool'
import { PassStatus, type IPass, type IPassInput, type IPassRow, type IPassSearchParams } from '../types'

const toPass = (row: IPassRow): IPass => ({
  id: row.id,
  code: row.code,
  holderName: row.holder_name,
  hostUserId: row.host_user_id,
  hostName: row.host_name,
  organization: row.organization,
  purpose: row.purpose,
  phone: row.phone,
  carPlate: row.car_plate,
  status: row.status,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
})

const toParams = (input: IPassInput) => [
  input.holderName,
  input.hostUserId,
  input.hostName,
  input.organization,
  input.purpose,
  input.phone,
  input.carPlate,
]

const CREATE_SQL = `
  INSERT INTO passes (holder_name, host_user_id, host_name, organization, purpose, phone, car_plate)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
const UPDATE_SQL = `
  UPDATE passes SET holder_name = $2, host_user_id = $3, host_name = $4, organization = $5, purpose = $6,
    phone = $7, car_plate = $8, updated_at = now()
  WHERE id = $1 RETURNING *`
const SET_STATUS_SQL = 'UPDATE passes SET status = $2, updated_at = now() WHERE id = $1 RETURNING *'
const DELETE_SQL = 'DELETE FROM passes WHERE id = $1 RETURNING id'
const FIND_BY_CODE_SQL = 'SELECT * FROM passes WHERE code = $1'
const FIND_SQL = 'SELECT * FROM passes WHERE id = $1'

const first = (rows: IPassRow[]): IPass | null => (rows[0] ? toPass(rows[0]) : null)

export const passesDb = {
  search: async (params: IPassSearchParams = {}) => {
    const conditions: string[] = []
    const values: (string | number)[] = []

    if (params.query?.trim()) {
      values.push(`%${params.query.trim()}%`)
      const idx = values.length
      conditions.push(`(holder_name ILIKE $${idx} OR host_name ILIKE $${idx} OR organization ILIKE $${idx} OR phone ILIKE $${idx} OR car_plate ILIKE $${idx})`)
    }

    if (params.status && params.status !== 'all') {
      values.push(params.status)
      conditions.push(`status = $${values.length}`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const countSql = `SELECT count(*)::text AS total FROM passes ${whereClause}`
    const countResult = await pool.query<{ total: string }>(countSql, values)
    const total = Number(countResult.rows[0]?.total ?? 0)

    const page = Math.max(Number(params.page) || 1, 1)
    const limit = Math.max(Number(params.limit) || 10, 1)
    const offset = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const listSql = `SELECT * FROM passes ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    const result = await pool.query<IPassRow>(listSql, [...values, limit, offset])

    return {
      items: result.rows.map(toPass),
      total,
      page,
      limit,
      totalPages,
    }
  },
  create: async (input: IPassInput) => {
    const result = await pool.query<IPassRow>(CREATE_SQL, toParams(input))
    return toPass(result.rows[0]!)
  },
  update: async (id: string, input: IPassInput) => {
    const result = await pool.query<IPassRow>(UPDATE_SQL, [id, ...toParams(input)])
    return first(result.rows)
  },
  setStatus: async (id: string, status: PassStatus) => {
    const result = await pool.query<IPassRow>(SET_STATUS_SQL, [id, status])
    return first(result.rows)
  },
  find: async (id: string) => first((await pool.query<IPassRow>(FIND_SQL, [id])).rows),
  findByCode: async (code: string) => first((await pool.query<IPassRow>(FIND_BY_CODE_SQL, [code])).rows),
  remove: async (id: string) => {
    const result = await pool.query(DELETE_SQL, [id])
    return (result.rowCount ?? 0) > 0
  },
}
