import { useCallback, useEffect, useMemo, useState } from 'react'
import { EMPTY_FILTERS, type IReportFilters } from '@/entities/report'
import { CashierStats } from '@/features/CashierStats'
import { DailyChart } from '@/features/DailyChart'
import { ReportFilters } from '@/features/ReportFilters'
import { ReportSummary } from '@/features/ReportSummary'
import { SalesTable } from '@/features/SalesTable'
import { TopProducts } from '@/features/TopProducts'
import { ApiRoutes } from '@/shared/config'
import { downloadFile, openPrintable } from '@/shared/lib'
import { If, Text } from '@/shared/ui'
import { useCashiersQuery, useDailyQuery, useSalesQuery, useSummaryQuery, useTopQuery } from './hooks'
import { queryOf } from './lib'
import {
  DESCRIPTION,
  EXPORT_DONE,
  EXPORT_FAILED,
  EXPORT_FILE,
  NOTICE_TIMEOUT_MS,
  RECEIPT_FILE,
  SALES_LIMIT,
  TITLE,
  TOP_LIMIT,
} from './model'
import { columns, head, headText, root } from './style'

export const SalesReport = () => {
  const [filters, setFilters] = useState<IReportFilters>(EMPTY_FILTERS)
  const [topPage, setTopPage] = useState(1)
  const [salesPage, setSalesPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [notice, setNotice] = useState<string | undefined>(undefined)

  const baseQuery = useMemo(() => queryOf(filters), [filters])
  const topQueryString = useMemo(() => queryOf(filters, topPage, TOP_LIMIT), [filters, topPage])
  const salesQueryString = useMemo(() => queryOf(filters, salesPage, SALES_LIMIT), [filters, salesPage])

  const summary = useSummaryQuery(baseQuery)
  const cashiers = useCashiersQuery(baseQuery)
  const daily = useDailyQuery(baseQuery)
  const top = useTopQuery(topQueryString)
  const sales = useSalesQuery(salesQueryString)

  useEffect(() => {
    if (notice === undefined) return
    const timer = setTimeout(() => setNotice(undefined), NOTICE_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [notice])

  const handleFilters = useCallback((next: IReportFilters) => {
    setFilters(next)
    setTopPage(1)
    setSalesPage(1)
  }, [])

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      await downloadFile(ApiRoutes.REPORTS_EXPORT(baseQuery), EXPORT_FILE)
      setNotice(EXPORT_DONE)
    } catch {
      setNotice(EXPORT_FAILED)
    }
    setExporting(false)
  }, [baseQuery])

  const handlePrintReceipt = useCallback((sale: { id: string }) => {
    void openPrintable(ApiRoutes.SALES_PRINT(sale.id), RECEIPT_FILE)
  }, [])

  const cashierOptions = useMemo(
    () => (cashiers.data ?? []).map((entry) => ({ id: entry.cashierId, label: entry.name })),
    [cashiers.data],
  )

  return (
    <div style={root} testId="report__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <If condition={notice !== undefined}>
          <Text variant="secondary">{notice ?? ''}</Text>
        </If>
      </div>
      <ReportFilters
        filters={filters}
        cashiers={cashierOptions}
        exporting={exporting}
        onChange={handleFilters}
        onExport={handleExport}
      />
      <ReportSummary summary={summary.data ?? null} />
      <DailyChart points={daily.data ?? []} />
      <div style={columns}>
        <TopProducts
          products={top.data?.items ?? []}
          page={top.data?.page ?? 1}
          totalPages={top.data?.totalPages ?? 1}
          total={top.data?.total ?? 0}
          onPageChange={setTopPage}
        />
        <CashierStats cashiers={cashiers.data ?? []} />
      </div>
      <SalesTable
        sales={sales.data?.items ?? []}
        page={sales.data?.page ?? 1}
        totalPages={sales.data?.totalPages ?? 1}
        total={sales.data?.total ?? 0}
        loading={sales.isPending}
        onPageChange={setSalesPage}
        onPrint={handlePrintReceipt}
      />
    </div>
  )
}
