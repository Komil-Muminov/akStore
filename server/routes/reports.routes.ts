import { Router, type Request, type Response, type NextFunction } from 'express'
import { rbacMiddleware } from '../middleware'
import { reportsService } from '../services'
import { UserRole } from '../types'
import { parsePeriod } from './reports.validation'
import { respond } from './respond'

const admin = rbacMiddleware(UserRole.ADMIN)
const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const queryOf = (req: Request) => req.query as Record<string, unknown>

export const reportsRouter = Router()

reportsRouter.get('/summary', admin, respond((req) => reportsService.summary(parsePeriod(queryOf(req)))))
reportsRouter.get('/passes', admin, respond((req) => reportsService.passes(parsePeriod(queryOf(req)))))
reportsRouter.get('/export', admin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = parsePeriod(queryOf(req))
    const file = await reportsService.exportExcel(period)
    res.setHeader('Content-Type', XLSX_TYPE)
    res.setHeader('Content-Disposition', `attachment; filename="gatepass-${period.from}-${period.to}.xlsx"`)
    res.send(file)
  } catch (error) {
    next(error)
  }
})
