import { categoriesDb, outletsDb, productsDb, stockDb, usersDb } from '../db'
import { auditService } from './audit.service'
import { HttpError, HttpStatus } from '../shared/utils'
import {
  AuditAction,
  StockMoveKind,
  type IProduct,
  type IProductInput,
  type IProductSearchParams,
  type IStockInput,
} from '../types'
import { labelsHtml } from './labels.print'

const HISTORY_LIMIT = 200
const NOT_FOUND = 'Товар не найден'
const BARCODE_TAKEN = 'Товар с таким штрихкодом уже есть'
const CATEGORY_TAKEN = 'Категория с таким названием уже есть'
const CATEGORY_NOT_EMPTY = 'В категории есть товары, сначала перенесите их'
const NEGATIVE_STOCK = 'Остаток не может стать отрицательным'

const orNotFound = async (id: string) => {
  const product = await productsDb.find(id)
  if (!product) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return product
}

const requireFreeBarcode = async (barcode: string, exceptId?: string) => {
  if (barcode.trim().length === 0) return
  const existing = await productsDb.findByBarcode(barcode)
  if (existing && existing.id !== exceptId) throw new HttpError(HttpStatus.BAD_REQUEST, BARCODE_TAKEN)
}

export const productsService = {
  search: async (params: IProductSearchParams) => productsDb.search(params),
  find: async (id: string) => orNotFound(id),
  findByBarcode: async (barcode: string) => {
    const product = await productsDb.findByBarcode(barcode)
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return product
  },
  create: async (input: IProductInput) => {
    await requireFreeBarcode(input.barcode)
    return orNotFound(await productsDb.create(input))
  },
  update: async (id: string, input: IProductInput, actorId?: string) => {
    const before = await orNotFound(id)
    await requireFreeBarcode(input.barcode, id)
    await productsDb.update(id, input)
    if (before.salePrice !== input.salePrice) {
      await auditService.record(
        actorId ?? null,
        AuditAction.PRODUCT_PRICE,
        before.name,
        id,
        `${before.salePrice} → ${input.salePrice}`,
      )
    }
    return orNotFound(id)
  },
  archive: async (id: string, actorId?: string) => {
    const product = await orNotFound(id)
    await productsDb.archive(id)
    await auditService.record(actorId ?? null, AuditAction.PRODUCT_ARCHIVE, product.name, id, '')
    return { id }
  },

  categories: async () => categoriesDb.list(),
  createCategory: async (name: string) => {
    if (await categoriesDb.findByName(name)) throw new HttpError(HttpStatus.BAD_REQUEST, CATEGORY_TAKEN)
    await categoriesDb.create(name)
    return categoriesDb.list()
  },
  renameCategory: async (id: string, name: string) => {
    const twin = await categoriesDb.findByName(name)
    if (twin && twin !== id) throw new HttpError(HttpStatus.BAD_REQUEST, CATEGORY_TAKEN)
    await categoriesDb.rename(id, name)
    return categoriesDb.list()
  },
  removeCategory: async (id: string, actorId?: string) => {
    const category = (await categoriesDb.list()).find((item) => item.id === id)
    if (category && category.productCount > 0) throw new HttpError(HttpStatus.BAD_REQUEST, CATEGORY_NOT_EMPTY)
    await categoriesDb.remove(id)
    await auditService.record(actorId ?? null, AuditAction.CATEGORY_DELETE, category?.name ?? '', id, '')
    return categoriesDb.list()
  },

  income: async (authorId: string, input: IStockInput) => {
    await orNotFound(input.productId)
    const outletId = (await usersDb.outletOf(authorId)) ?? (await outletsDb.first())
    await stockDb.register(
      input.productId,
      StockMoveKind.INCOME,
      input.quantity,
      input.costPrice,
      input.note,
      authorId,
      outletId,
    )
    return orNotFound(input.productId)
  },
  writeOff: async (authorId: string, input: IStockInput) => {
    const product = await orNotFound(input.productId)
    if (product.stock < input.quantity) throw new HttpError(HttpStatus.BAD_REQUEST, NEGATIVE_STOCK)
    const outletId = (await usersDb.outletOf(authorId)) ?? (await outletsDb.first())
    await stockDb.register(input.productId, StockMoveKind.WRITE_OFF, -input.quantity, 0, input.note, authorId, outletId)
    return orNotFound(input.productId)
  },
  inventory: async (authorId: string, input: IStockInput) => {
    const product = await orNotFound(input.productId)
    const delta = input.quantity - product.stock
    const outletId = (await usersDb.outletOf(authorId)) ?? (await outletsDb.first())
    await stockDb.register(input.productId, StockMoveKind.INVENTORY, delta, 0, input.note, authorId, outletId)
    return orNotFound(input.productId)
  },
  labels: async (ids: string[]) => {
    const products: IProduct[] = []
    for (const id of ids) {
      const product = await productsDb.find(id)
      if (product) products.push(product)
    }
    if (products.length === 0) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
    return labelsHtml(products)
  },

  history: async (productId: string | null) => stockDb.history(productId, HISTORY_LIMIT),
}
