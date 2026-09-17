import { pool } from './pool'
import type { IEntriesParams, IOnSite, IOnSiteRow, IPassEntry, IPassEntryRow } from '../types'
import { EntryDirection } from '../types'

const toEntry = (row: IPassEntryRow): IPassEntry => ({
  id: row.id,
  passId: row.pass_id,
  passCode: row.pass_code,
  holderName: row.holder_name,
  direction: row.direction,
  guardName: row.guard_name ?? '',
  happenedAt: row.happened_at.toISOString(),
})

const toOnSite = (row: IOnSiteRow): IOnSite => ({
  passId: row.pass_id,
  passCode: row.pass_code,
  holderName: row.holder_name,
  organization: row.organization,
  hostName: row.host_name,
  enteredAt: row.entered_at.toISOString(),
})

const CREATE_SQL = `
  INSERT INTO pass_entries (pass_id, direction, guard_id)
  VALUES ($1, $2, $3) RETURNING id`

const READ_SQL = `
  SELECT e.id, e.pass_id, p.code AS pass_code, p.holder_name, e.direction,
         u.full_name AS guard_name, e.happened_at
  FROM pass_entries e
  JOIN passes p ON p.id = e.pass_id
  LEFT JOIN users u ON u.id = e.guard_id`

const LAST_SQL = `${READ_SQL} WHERE e.pass_id = $1 ORDER BY e.happened_at DESC LIMIT 1`

const SEARCH_SQL = `${READ_SQL}
  WHERE ($1::timestamptz IS NULL OR e.happened_at >= $1)
    AND ($2::timestamptz IS NULL OR e.happened_at <= $2)
  ORDER BY e.happened_at DESC LIMIT $3`

const ON_SITE_SQL = `
  SELECT p.id AS pass_id, p.code AS pass_code, p.holder_name, p.organization,
         p.host_name, last.happened_at AS entered_at
  FROM passes p
  JOIN LATERAL (
    SELECT direction, happened_at FROM pass_entries
    WHERE pass_id = p.id ORDER BY happened_at DESC LIMIT 1
  ) last ON true
  WHERE last.direction = $1
  ORDER BY last.happened_at DESC`

export const entriesDb = {
  create: async (passId: string, direction: EntryDirection, guardId: string) => {
    await pool.query(CREATE_SQL, [passId, direction, guardId])
  },
  last: async (passId: string) => {
    const row = (await pool.query<IPassEntryRow>(LAST_SQL, [passId])).rows[0]
    return row ? toEntry(row) : null
  },
  search: async (params: IEntriesParams, limit: number) =>
    (await pool.query<IPassEntryRow>(SEARCH_SQL, [params.from ?? null, params.to ?? null, limit])).rows.map(toEntry),
  onSite: async () =>
    (await pool.query<IOnSiteRow>(ON_SITE_SQL, [EntryDirection.IN])).rows.map(toOnSite),
}
