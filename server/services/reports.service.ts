import { reportsDb } from '../db'
import type { IReportPeriod, IReportSummary } from '../types'
import { buildReportWorkbook } from './reports.excel'

const DAY_MS = 24 * 60 * 60 * 1000

const rangeOf = (period: IReportPeriod) => {
  const from = new Date(`${period.from}T00:00:00`)
  const to = new Date(new Date(`${period.to}T00:00:00`).getTime() + DAY_MS)
  return { from, to }
}

export const reportsService = {
  summary: async (period: IReportPeriod) => {
    const { from, to } = rangeOf(period)
    const totals = await reportsDb.totals(from, to)
    const byDay = await reportsDb.byDay(from, to)
    const topHosts = await reportsDb.topHosts(from, to)
    const summary: IReportSummary = { ...period, ...totals, byDay, topHosts }
    return summary
  },
  passes: async (period: IReportPeriod) => {
    const { from, to } = rangeOf(period)
    return reportsDb.list(from, to)
  },
  exportExcel: async (period: IReportPeriod) => {
    const { from, to } = rangeOf(period)
    const totals = await reportsDb.totals(from, to)
    const byDay = await reportsDb.byDay(from, to)
    const topHosts = await reportsDb.topHosts(from, to)
    const passes = await reportsDb.list(from, to)
    return buildReportWorkbook({ ...period, ...totals, byDay, topHosts }, passes)
  },
}
