import { debtsDb, productsDb, salesDb, stockDb } from '../db'
import { vatAmountOf } from '../fiscal'
import { HttpError, HttpStatus } from '../shared/utils'
import {
  PaymentKind,
  StockMoveKind,
  type IPageParams,
  type IProduct,
  type IReportParams,
  type IRefundInput,
  type ISaleInput,
} from '../types'
import QRCode from 'qrcode'
import { fiscalService } from './fiscal.service'
import { receiptHtml } from './receipt.print'
import { refundSales } from './sales.refund'
import { shiftsService } from './shifts.service'

const SALES_LIMIT = 200
const EMPTY_CART = 'Добавьте товары в чек'
const PRODUCT_MISSING = 'Товар не найден'
const NOT_ENOUGH = 'Недостаточно товара на остатке'
const NOT_PAID = 'Внесённая сумма меньше итога'
const SALE_MISSING = 'Чек не найден'
const DEBTOR_MISSING = 'Клиент не найден'
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

const paymentOf = (cash: number, card: number, debt: number) => {
  const count = (cash > 0 ? 1 : 0) + (card > 0 ? 1 : 0) + (debt > 0 ? 1 : 0)
  if (count > 1) return PaymentKind.MIXED
  if (debt > 0) return PaymentKind.DEBT
  return card > 0 ? PaymentKind.CARD : PaymentKind.CASH
}

export const salesService = {
  create: async (cashierId: string, input: ISaleInput) => {
    if (input.items.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_CART)
    const shift = await shiftsService.requireOpen(cashierId)
    const debtPaid = roundMoney(input.debtPaid ?? 0)

    if (debtPaid > 0) {
      if (!input.debtorId) throw new HttpError(HttpStatus.BAD_REQUEST, 'Выберите клиента для продажи в долг')
      const debtor = await debtsDb.find(input.debtorId)
      if (!debtor) throw new HttpError(HttpStatus.NOT_FOUND, DEBTOR_MISSING)
      if (debtor.creditLimit > 0 && debtor.balance + debtPaid > debtor.creditLimit) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          `Превышен лимит долга (${debtor.creditLimit} ₽). Текущий долг: ${debtor.balance} ₽`,
        )
      }
    }

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
    const paid = roundMoney(input.cashPaid + input.cardPaid + debtPaid)
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
      payment: paymentOf(input.cashPaid, input.cardPaid, debtPaid),
      total,
      discount,
      paid,
      cashAmount: input.cashPaid,
      cardAmount: input.cardPaid,
      debtAmount: debtPaid,
      debtorId: debtPaid > 0 ? (input.debtorId ?? null) : null,
      vatTotal,
    })
    for (const record of records) {
      await salesDb.addItem(saleId, record)
      await stockDb.register(record.productId, StockMoveKind.SALE, -record.quantity, 0, '', cashierId, shift.outletId)
    }

    if (debtPaid > 0 && input.debtorId) {
      await debtsDb.addMove(input.debtorId, saleId, cashierId, debtPaid, 'Продажа в долг')
    }

    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return fiscalService.registerSale(sale)
  },

  refundItems: async (cashierId: string, saleId: string, input: IRefundInput) =>
    refundSales.refundItems(cashierId, saleId, input),

  refund: async (cashierId: string, saleId: string) => refundSales.refund(cashierId, saleId),

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
