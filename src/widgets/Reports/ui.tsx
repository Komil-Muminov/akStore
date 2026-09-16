import { useCallback, useMemo, useState } from 'react'
import { ReportChart } from '@/features/ReportChart'
import { ReportHosts } from '@/features/ReportHosts'
import { ReportPeriod } from '@/features/ReportPeriod'
import { ReportSummary } from '@/features/ReportSummary'
import { ReportTable } from '@/features/ReportTable'
import { ReportPreset, fillDays, presetPeriod, type IReportPeriod, type IReportSummary } from '@/entities/report'
import { theme } from '@/shared/config'
import { Button, Icon, IconButton, If, Spinner, Text } from '@/shared/ui'
import { usePeriodPassesQuery, useReportExport, useSummaryQuery } from './hooks'
import { DESCRIPTION, EXPORT_DONE_PREFIX, EXPORT_LABEL, EXPORT_PENDING, INITIAL_PRESET, OPEN_FOLDER_LABEL, TITLE } from './model'
import { body, chartCell, charts, header, headerRow, headerText, hostsCell, layout, notice, noticeText } from './style'
import { ErrorState } from './ui/ErrorState'

export const Reports = () => {
  const [preset, setPreset] = useState<ReportPreset>(INITIAL_PRESET)
  const [period, setPeriod] = useState<IReportPeriod>(() => presetPeriod(INITIAL_PRESET))
  const summary = useSummaryQuery(period)
  const passes = usePeriodPassesQuery(period)
  const exporter = useReportExport()

  const handlePreset = useCallback((next: ReportPreset) => {
    setPreset(next)
    if (next !== ReportPreset.CUSTOM) setPeriod(presetPeriod(next))
  }, [])
  const handlePeriod = useCallback((next: IReportPeriod) => {
    setPreset(ReportPreset.CUSTOM)
    setPeriod(next)
  }, [])
  const exportPeriod = exporter.exportPeriod
  const handleExport = useCallback(() => void exportPeriod(period), [exportPeriod, period])
  const refetch = summary.refetch
  const handleRetry = useCallback(() => void refetch(), [refetch])
  const items = useMemo(() => passes.data ?? [], [passes.data])
  const days = useMemo(() => fillDays(period, summary.data?.byDay ?? []), [period, summary.data?.byDay])

  return (
    <div style={layout} testId="reports__layout">
      <div style={header}>
        <div style={headerRow}>
          <div style={headerText}>
            <Text variant="heading">{TITLE}</Text>
            <Text variant="secondary">{DESCRIPTION}</Text>
          </div>
          <Button label={exporter.pending ? EXPORT_PENDING : EXPORT_LABEL} icon="download" onClick={handleExport} disabled={exporter.pending} testId="reports__export" />
        </div>
        <ReportPeriod preset={preset} period={period} onPreset={handlePreset} onPeriod={handlePeriod} />
        <If condition={exporter.savedPath !== null}>
          <div style={notice} testId="reports__notice">
            <Icon name="check" size={theme.size.iconMd} color={theme.colors.accent} />
            <div style={noticeText}>
              <Text variant="body">{`${EXPORT_DONE_PREFIX}${exporter.savedPath ?? ''}`}</Text>
            </div>
            <Button label={OPEN_FOLDER_LABEL} icon="folderOpen" variant="secondary" onClick={() => void exporter.reveal()} testId="reports__reveal" />
            <IconButton icon="x" onClick={exporter.dismiss} />
          </div>
        </If>
        <If condition={exporter.error !== undefined}>
          <Text variant="danger">{exporter.error ?? ''}</Text>
        </If>
      </div>
      <If condition={summary.isPending} fallback={
        <If condition={summary.isError} fallback={
          <div style={body}>
            <ReportSummary summary={summary.data as IReportSummary} />
            <div style={charts}>
              <div style={chartCell}>
                <ReportChart days={days} />
              </div>
              <div style={hostsCell}>
                <ReportHosts hosts={summary.data?.topHosts ?? []} />
              </div>
            </div>
            <ReportTable passes={items} />
          </div>
        }>
          <ErrorState details={summary.error?.message ?? ''} onRetry={handleRetry} />
        </If>
      }>
        <Spinner />
      </If>
    </div>
  )
}
