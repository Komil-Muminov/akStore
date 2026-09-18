import type { IOutlet } from '@/entities/outlet'
import type { ICashierStat, IDailyPoint, IReportSummary, ITopProduct } from '@/entities/report'
import type { ISale } from '@/entities/sale'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import type { IPagedResponse } from '@/shared/model'

export const useOutletsQuery = () => useGetQuery<IOutlet[]>(QueryKeys.OUTLETS, ApiRoutes.OUTLETS_LIST)

export const useSummaryQuery = (filters: string) =>
  useGetQuery<IReportSummary>(QueryKeys.REPORT_SUMMARY, ApiRoutes.REPORTS_SUMMARY(filters))

export const useCashiersQuery = (filters: string) =>
  useGetQuery<ICashierStat[]>(QueryKeys.REPORT_CASHIERS, ApiRoutes.REPORTS_CASHIERS(filters))

export const useDailyQuery = (filters: string) =>
  useGetQuery<IDailyPoint[]>(QueryKeys.REPORT_DAILY, ApiRoutes.REPORTS_DAILY(filters))

export const useTopQuery = (filters: string) =>
  useGetQuery<IPagedResponse<ITopProduct>>(QueryKeys.REPORT_TOP, ApiRoutes.REPORTS_TOP(filters))

export const useSalesQuery = (filters: string) =>
  useGetQuery<IPagedResponse<ISale>>(QueryKeys.REPORT_SALES, ApiRoutes.REPORTS_SALES(filters))
