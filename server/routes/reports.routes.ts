import { Router, type Request, type Response, type NextFunction } from 'express'
import { rbacMiddleware } from '../middleware'
import { reportsService } from '../services'
import { UserRole } from '../types'
import { parsePageParams, parseReportParams } from './reports.validation'
import { respond } from './respond'

const manager = rbacMiddleware(UserRole.ADMIN)

export const reportsRouter = Router()

reportsRouter.get('/summary', manager, respond((req) => reportsService.summary(parseReportParams(req.query))))
reportsRouter.get('/cashiers', manager, respond((req) => reportsService.cashiers(parseReportParams(req.query))))
reportsRouter.get('/daily', manager, respond((req) => reportsService.daily(parseReportParams(req.query))))
reportsRouter.get('/hourly', manager, respond((req) => reportsService.hourly(parseReportParams(req.query))))
reportsRouter.get('/top-search', manager, respond((req) =>
  reportsService.topProducts(parseReportParams(req.query), parsePageParams(req.query)),
))
reportsRouter.get('/sales-search', manager, respond((req) =>
  reportsService.sales(parseReportParams(req.query), parsePageParams(req.query)),
))
const CSV_TYPE = 'text/csv; charset=utf-8'

const exportCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await reportsService.export(parseReportParams(req.query))
    res.setHeader('Content-Type', CSV_TYPE)
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`)
    res.send(file.content)
  } catch (error) {
    next(error)
  }
}

reportsRouter.get('/export', manager, exportCsv)
