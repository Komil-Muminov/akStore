import { invoicesDb, outletsDb, productsDb, stockDb, suppliersDb, usersDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { StockMoveKind, type IInvoiceInput, type ISupplierInput } from '../types'

const LIST_LIMIT = 100
const INVOICES_LIMIT = 100
const NOT_FOUND = 'Поставщик не найден'
const INVOICE_NOT_FOUND = 'Накладная не найдена'
const NAME_TAKEN = 'Поставщик с таким названием уже есть'
const EMPTY_ITEMS = 'В накладной нет позиций'
const PRODUCT_MISSING = 'Товар не найден'
const INVOICE_NOTE = 'Приход по накладной'

const round = (value: number) => Math.round(value * 100) / 100

const orNotFound = async (id: string) => {
  const supplier = await suppliersDb.find(id)
  if (!supplier) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return supplier
}

export const suppliersService = {
  search: async (query: string) => suppliersDb.list(query, LIST_LIMIT),

  create: async (input: ISupplierInput) => {
    if (await suppliersDb.findByName(input.name)) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    return orNotFound(await suppliersDb.create(input))
  },

  update: async (id: string, input: ISupplierInput) => {
    await orNotFound(id)
    const twin = await suppliersDb.findByName(input.name)
    if (twin && twin !== id) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    await suppliersDb.update(id, input)
    return orNotFound(id)
  },

  archive: async (id: string) => {
    await orNotFound(id)
    await suppliersDb.archive(id)
    return { id }
  },

  invoices: async (supplierId: string | null) => invoicesDb.list(supplierId, INVOICES_LIMIT),

  receive: async (authorId: string, input: IInvoiceInput) => {
    if (input.items.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_ITEMS)
    await orNotFound(input.supplierId)
    const outletId = (await usersDb.outletOf(authorId)) ?? (await outletsDb.first())

    const prepared = []
    let total = 0
    for (const item of input.items) {
      const product = await productsDb.find(item.productId)
      if (!product) throw new HttpError(HttpStatus.NOT_FOUND, PRODUCT_MISSING)
      total += item.quantity * item.costPrice
      prepared.push({ product, quantity: item.quantity, costPrice: item.costPrice })
    }

    const invoiceId = await invoicesDb.create(
      input.supplierId,
      outletId,
      authorId,
      round(total),
      Math.min(input.paid, round(total)),
      input.note,
    )
    for (const line of prepared) {
      await invoicesDb.addItem(invoiceId, line.product.id, line.product.name, line.quantity, line.costPrice)
      await stockDb.register(
        line.product.id,
        StockMoveKind.INCOME,
        line.quantity,
        line.costPrice,
        INVOICE_NOTE,
        authorId,
        outletId,
      )
    }

    const invoice = await invoicesDb.find(invoiceId)
    if (!invoice) throw new HttpError(HttpStatus.NOT_FOUND, INVOICE_NOT_FOUND)
    return invoice
  },

  payInvoice: async (id: string, amount: number) => {
    const invoice = await invoicesDb.find(id)
    if (!invoice) throw new HttpError(HttpStatus.NOT_FOUND, INVOICE_NOT_FOUND)
    await invoicesDb.pay(id, Math.min(amount, invoice.total - invoice.paid))
    return invoicesDb.find(id)
  },
}
