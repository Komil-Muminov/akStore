import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { auditService, backupService } from '../services'
import { HttpStatus } from '../shared/utils'
import { UserRole } from '../types'
import { parseReportParams } from './reports.validation'
import { respond } from './respond'

const QUERY_MAX = 40

const owner = rbacMiddleware(UserRole.ADMIN)

export const auditRouter = Router()

auditRouter.get('/search', owner, respond((req) => {
  const params = parseReportParams(req.query)
  const action = typeof req.query.action === 'string' ? req.query.action.slice(0, QUERY_MAX) : ''
  return auditService.search({ action, actorId: params.cashierId, from: params.from, to: params.to })
}))

auditRouter.get('/backups', owner, respond(() => backupService.list()))
auditRouter.post('/backup-create', owner, respond(() => backupService.create(), HttpStatus.CREATED))
