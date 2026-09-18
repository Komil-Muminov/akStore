import { pool } from './pool'
import type { IAuditEntry, IAuditParams, IAuditRow, AuditAction } from '../types'

const toEntry = (row: IAuditRow): IAuditEntry => ({
  id: row.id,
  actorName: row.actor_name ?? '',
  action: row.action,
  entity: row.entity,
  entityId: row.entity_id,
  details: row.details,
  createdAt: row.created_at.toISOString(),
})

const CREATE_SQL = `
  INSERT INTO audit_log (actor_id, action, entity, entity_id, details)
  VALUES ($1, $2, $3, $4, $5) RETURNING id`

const SEARCH_SQL = `
  SELECT a.id, u.full_name AS actor_name, a.action, a.entity, a.entity_id, a.details, a.created_at
  FROM audit_log a
  LEFT JOIN users u ON u.id = a.actor_id
  WHERE ($1::text IS NULL OR a.action = $1)
    AND ($2::uuid IS NULL OR a.actor_id = $2)
    AND ($3::timestamptz IS NULL OR a.created_at >= $3)
    AND ($4::timestamptz IS NULL OR a.created_at <= $4)
  ORDER BY a.created_at DESC LIMIT $5`

export const auditDb = {
  record: async (actorId: string | null, action: AuditAction, entity: string, entityId: string, details: string) => {
    await pool.query(CREATE_SQL, [actorId, action, entity, entityId, details])
  },
  search: async (params: IAuditParams, limit: number) =>
    (
      await pool.query<IAuditRow>(SEARCH_SQL, [
        params.action.length > 0 ? params.action : null,
        params.actorId,
        params.from,
        params.to,
        limit,
      ])
    ).rows.map(toEntry),
}
