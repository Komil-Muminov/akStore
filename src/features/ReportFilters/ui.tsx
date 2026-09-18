import { useCallback } from 'react'
import { PAYMENT_OPTIONS, PERIOD_OPTIONS, PeriodKind, type IReportFilters } from '@/entities/report'
import { Button, Select, Text, TextInput, Tooltip } from '@/shared/ui'
import {
  ALL_CASHIERS,
  ALL_OUTLETS,
  ALL_PAYMENTS,
  CASHIER_LABEL,
  EXPORT_LABEL,
  EXPORT_TOOLTIP,
  OUTLET_LABEL,
  PAYMENT_LABEL,
  PERIOD_LABEL,
  SEARCH_PLACEHOLDER,
  type IProps,
} from './model'
import { field, root, searchField, spacer } from './style'

export const ReportFilters = ({ filters, outlets, cashiers, exporting, onChange, onExport }: IProps) => {
  const patch = useCallback((part: Partial<IReportFilters>) => onChange({ ...filters, ...part }), [filters, onChange])

  const setPeriod = useCallback(
    (value: string | null) => patch({ period: (value ?? PeriodKind.TODAY) as PeriodKind }),
    [patch],
  )
  const setOutlet = useCallback((outletId: string | null) => patch({ outletId }), [patch])
  const setCashier = useCallback((cashierId: string | null) => patch({ cashierId }), [patch])
  const setPayment = useCallback((payment: string | null) => patch({ payment }), [patch])
  const setQuery = useCallback((query: string) => patch({ query }), [patch])

  return (
    <div style={root} testId="report__filters">
      <div style={field}>
        <Text variant="label">{PERIOD_LABEL}</Text>
        <Select value={filters.period} options={PERIOD_OPTIONS} onChange={setPeriod} testId="report__period" />
      </div>
      <div style={field}>
        <Text variant="label">{OUTLET_LABEL}</Text>
        <Select
          value={filters.outletId}
          options={outlets}
          placeholder={ALL_OUTLETS}
          onChange={setOutlet}
          testId="report__outlet"
        />
      </div>
      <div style={field}>
        <Text variant="label">{CASHIER_LABEL}</Text>
        <Select
          value={filters.cashierId}
          options={cashiers}
          placeholder={ALL_CASHIERS}
          onChange={setCashier}
          testId="report__cashier"
        />
      </div>
      <div style={field}>
        <Text variant="label">{PAYMENT_LABEL}</Text>
        <Select
          value={filters.payment}
          options={PAYMENT_OPTIONS}
          placeholder={ALL_PAYMENTS}
          onChange={setPayment}
          testId="report__payment"
        />
      </div>
      <div style={searchField}>
        <TextInput
          value={filters.query}
          onChange={setQuery}
          placeholder={SEARCH_PLACEHOLDER}
          icon="search"
          testId="report__search"
        />
      </div>
      <div style={spacer} />
      <Tooltip title={EXPORT_TOOLTIP}>
        <Button
          label={EXPORT_LABEL}
          icon="download"
          variant="secondary"
          onClick={onExport}
          disabled={exporting}
          testId="report__export"
        />
      </Tooltip>
    </div>
  )
}
