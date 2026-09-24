import { salesDb, stockDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { AuditAction, StockMoveKind, type IRefundInput } from '../types'
import { auditService } from './audit.service'
import { fiscalService } from './fiscal.service'
import { shiftsService } from './shifts.service'

const SALE_MISSING = 'Чек не найден'
const ALREADY_REFUNDED = 'Чек уже возвращён'
const NOTHING_TO_REFUND = 'Нечего возвращать: позиции уже вернули'
const ITEM_MISSING = 'Позиция не найдена в чеке'
const REFUND_NOTE = 'Возврат по чеку'

const roundMoney = (value: number) => Math.round(value * 100) / 100

export const refundSales = {
  refundItems: async (cashierId: string, saleId: string, input: IRefundInput) => {
    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    if (sale.refundedAt !== null) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_REFUNDED)
    const shift = await shiftsService.requireOpen(cashierId)

    let refundAmount = 0
    for (const entry of input.items) {
      const item = sale.items.find((line) => line.id === entry.itemId)
      if (!item) throw new HttpError(HttpStatus.NOT_FOUND, ITEM_MISSING)
      const available = item.quantity - item.refunded
      if (available < entry.quantity) throw new HttpError(HttpStatus.BAD_REQUEST, NOTHING_TO_REFUND)
      const share = item.quantity > 0 ? (item.total / item.quantity) * entry.quantity : 0
      refundAmount += share
      await salesDb.refundItem(item.id, entry.quantity)
      await stockDb.register(
        item.productId,
        StockMoveKind.REFUND,
        entry.quantity,
        0,
        REFUND_NOTE,
        cashierId,
        shift.outletId,
      )
    }

    await salesDb.addRefundTotal(saleId, roundMoney(refundAmount))
    const updated = await salesDb.find(saleId)
    if (!updated) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    await auditService.record(
      cashierId,
      AuditAction.SALE_REFUND,
      `Чек №${String(updated.number)}`,
      saleId,
      roundMoney(refundAmount).toFixed(2),
    )
    return updated.refundedAt === null ? updated : fiscalService.registerRefund(updated)
  },

  refund: async (cashierId: string, saleId: string) => {
    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    if (sale.refundedAt !== null) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_REFUNDED)
    const shift = await shiftsService.requireOpen(cashierId)
    await salesDb.refund(saleId)
    for (const item of sale.items) {
      await stockDb.register(
        item.productId,
        StockMoveKind.REFUND,
        item.quantity,
        0,
        REFUND_NOTE,
        cashierId,
        shift.outletId,
      )
    }
    const refunded = await salesDb.find(saleId)
    if (!refunded) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    await auditService.record(
      cashierId,
      AuditAction.SALE_REFUND,
      `Чек №${String(refunded.number)}`,
      saleId,
      String(refunded.total),
    )
    return fiscalService.registerRefund(refunded)
  },
}
