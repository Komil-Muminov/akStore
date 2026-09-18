import { auditDb } from '../db'
import type { AuditAction, IAuditParams } from '../types'

const LIST_LIMIT = 200

export const auditService = {
  record: async (actorId: string | null, action: AuditAction, entity: string, entityId: string, details: string) => {
    try {
      await auditDb.record(actorId, action, entity, entityId, details)
    } catch (error) {
      console.error('Не удалось записать действие в журнал', error)
    }
  },
  search: async (params: IAuditParams) => auditDb.search(params, LIST_LIMIT),
}
