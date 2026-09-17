import { HttpError, HttpStatus, optionalString, requireString, requireUuid } from '../shared/utils'
import { PaymentKind, ProductUnit, type IProductInput, type ISaleInput, type IStockInput } from '../types'

const NAME_MIN = 2
const NAME_MAX = 120
const BARCODE_MAX = 32
const NOTE_MAX = 200
const MONEY_MAX = 99_999_999
const QUANTITY_MAX = 100_000
const ITEMS_MAX = 200
const VAT_MAX = 100
const MARK_MAX = 64
const MONEY_ERROR = 'Сумма указана неверно'
const VAT_ERROR = 'Ставка НДС указана неверно'
const QUANTITY_ERROR = 'Количество должно быть больше нуля'
const ITEMS_ERROR = `В чеке должно быть от 1 до ${ITEMS_MAX} позиций`
const UNIT_ERROR = 'Неизвестная единица измерения'
const PAYMENT_ERROR = 'Неизвестный способ оплаты'

const asRecord = (value: unknown) => (value ?? {}) as Record<string, unknown>

const money = (value: unknown, field: string) => {
  const parsed = Number(value ?? 0)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MONEY_MAX) {
    throw new HttpError(HttpStatus.BAD_REQUEST, `${MONEY_ERROR}: ${field}`)
  }
  return Math.round(parsed * 100) / 100
}

const quantity = (value: unknown) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > QUANTITY_MAX) {
    throw new HttpError(HttpStatus.BAD_REQUEST, QUANTITY_ERROR)
  }
  return Math.round(parsed * 1000) / 1000
}

const vatRate = (value: unknown) => {
  const parsed = Number(value ?? 0)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > VAT_MAX) {
    throw new HttpError(HttpStatus.BAD_REQUEST, VAT_ERROR)
  }
  return Math.round(parsed * 100) / 100
}

export const parseProductInput = (body: unknown): IProductInput => {
  const raw = asRecord(body)
  const unit = String(raw.unit ?? ProductUnit.PIECE)
  if (!Object.values(ProductUnit).includes(unit as ProductUnit)) {
    throw new HttpError(HttpStatus.BAD_REQUEST, UNIT_ERROR)
  }
  return {
    barcode: optionalString(raw.barcode, 'barcode', BARCODE_MAX),
    name: requireString(raw.name, 'name', NAME_MIN, NAME_MAX),
    categoryId: raw.categoryId ? requireUuid(raw.categoryId, 'categoryId') : null,
    unit: unit as ProductUnit,
    costPrice: money(raw.costPrice, 'costPrice'),
    salePrice: money(raw.salePrice, 'salePrice'),
    vatRate: vatRate(raw.vatRate),
    markCode: optionalString(raw.markCode, 'markCode', MARK_MAX),
  }
}

export const parseStockInput = (body: unknown): IStockInput => {
  const raw = asRecord(body)
  return {
    productId: requireUuid(raw.productId, 'productId'),
    quantity: quantity(raw.quantity),
    costPrice: money(raw.costPrice, 'costPrice'),
    note: optionalString(raw.note, 'note', NOTE_MAX),
  }
}

export const parseInventoryInput = (body: unknown): IStockInput => {
  const raw = asRecord(body)
  const counted = Number(raw.quantity)
  if (!Number.isFinite(counted) || counted < 0) throw new HttpError(HttpStatus.BAD_REQUEST, QUANTITY_ERROR)
  return {
    productId: requireUuid(raw.productId, 'productId'),
    quantity: Math.round(counted * 1000) / 1000,
    costPrice: 0,
    note: optionalString(raw.note, 'note', NOTE_MAX),
  }
}

export const parseCategoryName = (body: unknown) =>
  requireString(asRecord(body).name, 'name', NAME_MIN, NAME_MAX)

export const parseSaleInput = (body: unknown): ISaleInput => {
  const raw = asRecord(body)
  const items = Array.isArray(raw.items) ? raw.items : []
  if (items.length === 0 || items.length > ITEMS_MAX) throw new HttpError(HttpStatus.BAD_REQUEST, ITEMS_ERROR)
  const payment = String(raw.payment ?? PaymentKind.CASH)
  if (!Object.values(PaymentKind).includes(payment as PaymentKind)) {
    throw new HttpError(HttpStatus.BAD_REQUEST, PAYMENT_ERROR)
  }
  return {
    items: (items as Record<string, unknown>[]).map((item) => ({
      productId: requireUuid(item.productId, 'productId'),
      quantity: quantity(item.quantity),
    })),
    payment: payment as PaymentKind,
    discount: money(raw.discount, 'discount'),
    paid: money(raw.paid, 'paid'),
  }
}

export const parseCash = (body: unknown, field: string) => money(asRecord(body)[field], field)

export const parseNote = (body: unknown) => optionalString(asRecord(body).note, 'note', NOTE_MAX)
