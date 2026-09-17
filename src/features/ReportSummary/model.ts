import type { IReportSummary } from '@/entities/report'

export interface IProps {
  summary: IReportSummary | null
}

export const REVENUE_LABEL = 'Выручка'
export const PROFIT_LABEL = 'Прибыль'
export const MARGIN_LABEL = 'Маржа'
export const RECEIPTS_LABEL = 'Чеков'
export const AVERAGE_LABEL = 'Средний чек'
export const COST_LABEL = 'Себестоимость'
export const VAT_LABEL = 'НДС'
export const REFUNDS_LABEL = 'Возвраты'
