import { pool } from './pool'
import type { IPass, IPassRow, IReportDay, IReportHost } from '../types'

const TOP_HOSTS_LIMIT = 10
const LIST_LIMIT = 2000

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

const TOTALS_SQL = `
  SELECT count(*)::text AS issued,
         count(*) FILTER (WHERE status = 'active')::text AS active,
         count(*) FILTER (WHERE status = 'revoked')::text AS revoked,
         count(DISTINCT lower(holder_name))::text AS unique_holders
  FROM passes WHERE created_at >= $1 AND created_at < $2`
const BY_DAY_SQL = `
  SELECT to_char(created_at::date, 'YYYY-MM-DD') AS date,
         count(*)::text AS issued,
         count(*) FILTER (WHERE status = 'revoked')::text AS revoked
  FROM passes WHERE created_at >= $1 AND created_at < $2
  GROUP BY created_at::date ORDER BY created_at::date`
const TOP_HOSTS_SQL = `
  SELECT host_name, count(*)::text AS total
  FROM passes WHERE created_at >= $1 AND created_at < $2 AND host_name <> ''
  GROUP BY host_name ORDER BY count(*) DESC, host_name LIMIT $3`
const LIST_SQL = `
  SELECT * FROM passes WHERE created_at >= $1 AND created_at < $2
  ORDER BY created_at DESC LIMIT $3`

interface ITotalsRow {
  issued: string
  active: string
  revoked: string
  unique_holders: string
}

export const reportsDb = {
  totals: async (from: Date, to: Date) => {
    const row = (await pool.query<ITotalsRow>(TOTALS_SQL, [from, to])).rows[0]
    return {
      issued: Number(row?.issued ?? 0),
      active: Number(row?.active ?? 0),
      revoked: Number(row?.revoked ?? 0),
      uniqueHolders: Number(row?.unique_holders ?? 0),
    }
  },
  byDay: async (from: Date, to: Date) =>
    (await pool.query<{ date: string; issued: string; revoked: string }>(BY_DAY_SQL, [from, to])).rows.map((row): IReportDay => ({
      date: row.date,
      issued: Number(row.issued),
      revoked: Number(row.revoked),
    })),
  topHosts: async (from: Date, to: Date) =>
    (await pool.query<{ host_name: string; total: string }>(TOP_HOSTS_SQL, [from, to, TOP_HOSTS_LIMIT])).rows.map((row): IReportHost => ({
      hostName: row.host_name,
      count: Number(row.total),
    })),
  list: async (from: Date, to: Date) =>
    (await pool.query<IPassRow>(LIST_SQL, [from, to, LIST_LIMIT])).rows.map((row): IPass => toPass(row)),
}
