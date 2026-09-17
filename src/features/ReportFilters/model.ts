import type { IReportFilters } from '@/entities/report'

export interface ICashierOption {
  id: string
  label: string
}

export interface IProps {
  filters: IReportFilters
  cashiers: ICashierOption[]
  exporting: boolean
  onChange: (filters: IReportFilters) => void
  onExport: () => void
}

export const PERIOD_LABEL = 'Период'
export const CASHIER_LABEL = 'Кассир'
export const PAYMENT_LABEL = 'Оплата'
export const SEARCH_PLACEHOLDER = 'Номер чека или кассир'
export const ALL_CASHIERS = 'Все кассиры'
export const ALL_PAYMENTS = 'Любая оплата'
export const EXPORT_LABEL = 'Выгрузить'
export const EXPORT_TOOLTIP = 'Сохранить таблицу в CSV для Excel'
