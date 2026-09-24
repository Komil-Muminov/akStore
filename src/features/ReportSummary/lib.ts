import { moneyOf } from '@/entities/product'
import { percentOf, type IReportSummary } from '@/entities/report'
import {
  AVERAGE_LABEL,
  CARD_LABEL,
  CASH_LABEL,
  COST_LABEL,
  MARGIN_LABEL,
  PROFIT_LABEL,
  RECEIPTS_LABEL,
  REFUNDS_LABEL,
  REVENUE_LABEL,
  VAT_LABEL,
} from './model'

export interface ICard {
  label: string
  value: string
  tone: 'accent' | 'plain' | 'muted'
}

export const cardsOf = (summary: IReportSummary | null): ICard[] => [
  { label: REVENUE_LABEL, value: moneyOf(summary?.revenue ?? 0), tone: 'accent' },
  { label: PROFIT_LABEL, value: moneyOf(summary?.profit ?? 0), tone: 'accent' },
  { label: MARGIN_LABEL, value: percentOf(summary?.margin ?? 0), tone: 'plain' },
  { label: RECEIPTS_LABEL, value: String(summary?.salesCount ?? 0), tone: 'plain' },
  { label: AVERAGE_LABEL, value: moneyOf(summary?.average ?? 0), tone: 'plain' },
  { label: CASH_LABEL, value: moneyOf(summary?.cashTotal ?? 0), tone: 'plain' },
  { label: CARD_LABEL, value: moneyOf(summary?.cardTotal ?? 0), tone: 'plain' },
  { label: COST_LABEL, value: moneyOf(summary?.cost ?? 0), tone: 'muted' },
  { label: VAT_LABEL, value: moneyOf(summary?.vatTotal ?? 0), tone: 'muted' },
  { label: REFUNDS_LABEL, value: moneyOf(summary?.refundTotal ?? 0), tone: 'muted' },
]
