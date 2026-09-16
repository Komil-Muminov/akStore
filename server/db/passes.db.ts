import { pool } from './pool'
import { PassStatus, type IPass, type IPassInput, type IPassRow } from '../types'

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

const SEARCH_SQL = 'SELECT * FROM passes ORDER BY created_at DESC'
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
  search: async (): Promise<IPass[]> => {
    const result = await pool.query<IPassRow>(SEARCH_SQL)
    return result.rows.map(toPass)
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
