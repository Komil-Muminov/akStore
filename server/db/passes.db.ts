import { pool } from './pool'
import { PassStatus, type IPass, type IPassInput, type IPassRow, type IPagedResult, type IPassSearchParams } from '../types'

const toPass = (row: IPassRow): IPass => ({
  id: row.id,
  holderName: row.holder_name,
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
  input.hostName,
  input.organization,
  input.purpose,
  input.phone,
  input.carPlate,
]

const CREATE_SQL = `
  INSERT INTO passes (holder_name, host_name, organization, purpose, phone, car_plate)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
const UPDATE_SQL = `
  UPDATE passes SET holder_name = $2, host_name = $3, organization = $4, purpose = $5,
    phone = $6, car_plate = $7, updated_at = now()
  WHERE id = $1 RETURNING *`
const SET_STATUS_SQL = 'UPDATE passes SET status = $2, updated_at = now() WHERE id = $1 RETURNING *'
const DELETE_SQL = 'DELETE FROM passes WHERE id = $1 RETURNING id'

const first = (rows: IPassRow[]): IPass | null => (rows[0] ? toPass(rows[0]) : null)

export const passesDb = {
  search: async (params: IPassSearchParams = {}): Promise<IPagedResult<IPass>> => {
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
  create: async (input: IPassInput): Promise<IPass> => {
    const result = await pool.query<IPassRow>(CREATE_SQL, toParams(input))
    return toPass(result.rows[0]!)
  },
  update: async (id: string, input: IPassInput): Promise<IPass | null> => {
    const result = await pool.query<IPassRow>(UPDATE_SQL, [id, ...toParams(input)])
    return first(result.rows)
  },
  setStatus: async (id: string, status: PassStatus): Promise<IPass | null> => {
    const result = await pool.query<IPassRow>(SET_STATUS_SQL, [id, status])
    return first(result.rows)
  },
  remove: async (id: string): Promise<boolean> => {
    const result = await pool.query(DELETE_SQL, [id])
    return (result.rowCount ?? 0) > 0
  },
}
