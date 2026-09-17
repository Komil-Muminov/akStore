import { productsDb, salesDb, stockDb } from '../db'
import { fiscalDriver } from '../fiscal'
import { HttpError, HttpStatus } from '../shared/utils'
import { StockMoveKind, type ISale, type ISaleInput, type ISalesParams } from '../types'
import { shiftsService } from './shifts.service'

const SALES_LIMIT = 200
const EMPTY_CART = 'Добавьте товары в чек'
const PRODUCT_MISSING = 'Товар не найден'
const NOT_ENOUGH = 'Недостаточно товара на остатке'
const NOT_PAID = 'Внесённая сумма меньше итога'
const SALE_MISSING = 'Чек не найден'
const ALREADY_REFUNDED = 'Чек уже возвращён'
const REFUND_NOTE = 'Возврат по чеку'

const roundMoney = (value: number) => Math.round(value * 100) / 100

const registerFiscal = async (sale: ISale) => {
  if (!fiscalDriver.enabled) return sale
  try {
    const receipt = await fiscalDriver.register(sale)
    if (!receipt) return sale
    await salesDb.attachFiscal(sale.id, receipt.number, receipt.sign, receipt.device)
    return (await salesDb.find(sale.id)) ?? sale
  } catch (error) {
    console.error('Фискальный регистратор не принял чек', error)
    return sale
  }
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
      subtotal += product.salePrice * item.quantity
      prepared.push({ product, quantity: item.quantity })
    }

    const discount = Math.min(roundMoney(input.discount), subtotal)
    const total = roundMoney(subtotal - discount)
    if (input.paid < total) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_PAID)

    const saleId = await salesDb.create(shift.id, cashierId, input.payment, total, discount, input.paid)
    for (const line of prepared) {
      await salesDb.addItem(
        saleId,
        line.product.id,
        line.product.name,
        line.quantity,
        line.product.salePrice,
        line.product.costPrice,
      )
      await stockDb.register(line.product.id, StockMoveKind.SALE, -line.quantity, 0, '', cashierId)
    }

    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return registerFiscal(sale)
  },

  refund: async (cashierId: string, saleId: string) => {
    const sale = await salesDb.find(saleId)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    if (sale.refundedAt !== null) throw new HttpError(HttpStatus.BAD_REQUEST, ALREADY_REFUNDED)
    await shiftsService.requireOpen(cashierId)
    await salesDb.refund(saleId)
    for (const item of sale.items) {
      await stockDb.register(item.productId, StockMoveKind.REFUND, item.quantity, 0, REFUND_NOTE, cashierId)
    }
    const refunded = await salesDb.find(saleId)
    if (!refunded) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return refunded
  },

  find: async (id: string) => {
    const sale = await salesDb.find(id)
    if (!sale) throw new HttpError(HttpStatus.NOT_FOUND, SALE_MISSING)
    return sale
  },

  search: async (params: ISalesParams) => salesDb.search(params, Math.min(params.limit ?? SALES_LIMIT, SALES_LIMIT)),
}
