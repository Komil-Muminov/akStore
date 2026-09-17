import { moneyOf } from '@/entities/product'
import type { ISale } from '@/entities/sale'
import { AVERAGE_LABEL, RECEIPTS_LABEL, REFUNDS_LABEL, REVENUE_LABEL, VAT_SUM_LABEL } from './model'

export const summaryOf = (sales: ISale[]) => {
  const active = sales.filter((sale) => sale.refundedAt === null)
  const revenue = active.reduce((sum, sale) => sum + sale.total, 0)
  const refunds = sales.filter((sale) => sale.refundedAt !== null).reduce((sum, sale) => sum + sale.total, 0)
  const average = active.length > 0 ? revenue / active.length : 0
  const vat = active.reduce((sum, sale) => sum + sale.vatTotal, 0)
  return [
    { label: REVENUE_LABEL, value: moneyOf(revenue), muted: false },
    { label: RECEIPTS_LABEL, value: String(active.length), muted: true },
    { label: AVERAGE_LABEL, value: moneyOf(average), muted: false },
    { label: REFUNDS_LABEL, value: moneyOf(refunds), muted: true },
    { label: VAT_SUM_LABEL, value: moneyOf(vat), muted: true },
  ]
}
