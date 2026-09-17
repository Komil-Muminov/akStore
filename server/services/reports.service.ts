import { reportsDb, salesDb, topProductsDb } from '../db'
import type { IPageParams, IReportParams } from '../types'
import { csvOf } from './reports.export'

const EXPORT_LIMIT = 5000
const EXPORT_PAGE: IPageParams = { page: 1, limit: EXPORT_LIMIT }

export const reportsService = {
  summary: async (params: IReportParams) => reportsDb.summary(params),
  cashiers: async (params: IReportParams) => reportsDb.cashiers(params),
  daily: async (params: IReportParams) => reportsDb.daily(params),
  topProducts: async (params: IReportParams, page: IPageParams) => topProductsDb.search(params, page),
  sales: async (params: IReportParams, page: IPageParams) => salesDb.search(params, page),
  export: async (params: IReportParams) => {
    const found = await salesDb.search(params, EXPORT_PAGE)
    return csvOf(found.items)
  },
}
