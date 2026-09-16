import { useCallback, useState } from 'react'
import type { IPass } from '@/entities/pass'
import { exportFileName, periodQuery, type IReportPeriod, type IReportSummary } from '@/entities/report'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'
import { downloadFile, revealFile } from '@/shared/lib'

export const useSummaryQuery = (period: IReportPeriod) =>
  useGetQuery<IReportSummary>(QueryKeys.REPORT_SUMMARY, ApiRoutes.REPORTS_SUMMARY(periodQuery(period)))

export const usePeriodPassesQuery = (period: IReportPeriod) =>
  useGetQuery<IPass[]>(QueryKeys.REPORT_PASSES, ApiRoutes.REPORTS_PASSES(periodQuery(period)))

export const useReportExport = () => {
  const [pending, setPending] = useState(false)
  const [savedPath, setSavedPath] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const exportPeriod = useCallback(async (period: IReportPeriod) => {
    setPending(true)
    setError(undefined)
    try {
      const path = await downloadFile(ApiRoutes.REPORTS_EXPORT(periodQuery(period)), exportFileName(period))
      setSavedPath(path)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure))
    } finally {
      setPending(false)
    }
  }, [])

  const reveal = useCallback(async () => {
    if (savedPath) await revealFile(savedPath)
  }, [savedPath])

  const dismiss = useCallback(() => setSavedPath(null), [])

  return { pending, savedPath, error, exportPeriod, reveal, dismiss }
}
