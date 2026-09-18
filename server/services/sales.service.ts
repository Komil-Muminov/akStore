import { productsDb, salesDb, stockDb } from '../db'
import { vatAmountOf } from '../fiscal'
import { HttpError, HttpStatus } from '../shared/utils'
import {
  AuditAction,
  PaymentKind,
  StockMoveKind,
  type IPageParams,
  type IProduct,
  type IReportParams,
  type IRefundInput,
  type ISaleInput,
} from '../types'
import QRCode from 'qrcode'
import { auditService } from './audit.service'
import { fiscalService } from './fiscal.service'
import { receiptHtml } from './receipt.print'
import { shiftsService } from './shifts.service'

const SALES_LIMIT = 200
const EMPTY_CART = 'Добавьте товары в чек'
const PRODUCT_MISSING = 'Товар не найден'
const NOT_ENOUGH = 'Недостаточно товара на остатке'
const NOT_PAID = 'Внесённая сумма меньше итога'
const SALE_MISSING = 'Чек не найден'
const ALREADY_REFUNDED = 'Чек уже возвращён'
const NOTHING_TO_REFUND = 'Нечего возвращать: позиции уже вернули'
const ITEM_MISSING = 'Позиция не найдена в чеке'
const REFUND_NOTE = 'Возврат по чеку'
const QR_WIDTH = 120

const roundMoney = (value: number) => Math.round(value * 100) / 100

const itemRecordOf = (product: IProduct, quantity: number, discount: number) => {
  const total = roundMoney(product.salePrice * quantity - discount)
  return {
    productId: product.id,
    name: product.name,
    quantity,
    price: product.salePrice,
    discount,
    costPrice: product.costPrice,
    vatRate: product.vatRate,
    vatAmount: vatAmountOf(total, product.vatRate),
    markCode: product.markCode,
  }
}

const paymentOf = (cashPaid: number, cardPaid: number) => {
  if (cashPaid > 0 && cardPaid > 0) return PaymentKind.MIXED
  return cardPaid > 0 ? PaymentKind.CARD : PaymentKind.CASH
}

export const salesService = {
  create: async (cashierId: string, input: ISaleInput) => {
    if (input.items.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_CART)
    const shift = await shiftsService.requireOpen(cashierId)

    const prepared = []
    let subtotal = 0
    for (const item of input.items) {
      const product = await productsDb.find(item.productId)
      if (!product) throw new HttpError(HttpStatus.NOT_FOUND, PRODUCT_MISSING)
      if (product.stock < item.quantity) {
        throw new HttpError(HttpStatus.BAD_REQUEST, `${NOT_ENOUGH}: ${product.name}`)
      }
      const lineDiscount = Math.min(item.discount, product.salePrice * item.quantity)
      subtotal += product.salePrice * item.quantity - lineDiscount
      prepared.push({ product, quantity: item.quantity, lineDiscount })
    }

    const discount = Math.min(roundMoney(input.discount), subtotal)
    const total = roundMoney(subtotal - discount)
    const paid = roundMoney(input.cashPaid + input.cardPaid)
    if (paid < total) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_PAID)

    const records = prepared.map((line) => {
      const lineTotal = line.product.salePrice * line.quantity - line.lineDiscount
      const share = subtotal > 0 ? roundMoney((discount * lineTotal) / subtotal) : 0
      return itemRecordOf(line.product, line.quantity, roundMoney(line.lineDiscount + share))
    })
    const vatTotal = roundMoney(records.reduce((sum, record) => sum + record.vatAmount, 0))

    const saleId = await salesDb.create({
      shiftId: shift.id,
      cashierId,
      outletId: shift.outletId,
      payment: paymentOf(input.cashPaid, input.cardPaid),
      total,
      discount,
      paid,
      cashAmount: input.cashPaid,
      cardAmount: input.cardPaid,
      vatTotal,
    })
    for (const record of records) {
      await salesDb.addItem(saleId, record)
      await stockDb.register(record.productId, StockMoveKind.SALE, -record.quantity, 0, '', cashierId, shift.outletId)
    }

    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return fiscalService.registerSale(sale)
  },

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

  printable: async (id: string) => {
    const sale = await salesDb.find(id)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    const qr =
      sale.fiscal && sale.fiscal.qr.length > 0
        ? await QRCode.toString(sale.fiscal.qr, { type: 'svg', width: QR_WIDTH, margin: 0 })
        : ''
    return receiptHtml(sale, qr)
  },

  find: async (id: string) => {
    const sale = await salesDb.find(id)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return sale
  },

  search: async (params: IReportParams, page: IPageParams) =>
    salesDb.search(params, { page: page.page, limit: Math.min(page.limit, SALES_LIMIT) }),
}
