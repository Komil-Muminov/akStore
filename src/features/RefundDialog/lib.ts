import type { ISale } from '@/entities/sale'

export const availableOf = (item: ISale['items'][number]) => Math.max(0, item.quantity - item.refunded)

export const lineAmountOf = (item: ISale['items'][number], quantity: number) =>
  item.quantity > 0 ? Math.round((item.total / item.quantity) * quantity * 100) / 100 : 0

export const refundTotalOf = (sale: ISale | null, picked: Record<string, number>) => {
  if (!sale) return 0
  return Math.round(
    sale.items.reduce((sum, item) => sum + lineAmountOf(item, picked[item.id] ?? 0), 0) * 100,
  ) / 100
}
