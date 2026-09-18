import { outletsDb, productsDb, stockDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { StockMoveKind, type IOutletInput, type ITransferInput } from '../types'

const NOT_FOUND = 'Точка не найдена'
const NAME_TAKEN = 'Точка с таким названием уже есть'
const PRODUCT_MISSING = 'Товар не найден'
const SAME_OUTLET = 'Точки отправления и назначения совпадают'
const NOT_ENOUGH = 'На точке недостаточно товара'
const TRANSFER_OUT = 'Перемещение на другую точку'
const TRANSFER_IN = 'Поступление с другой точки'

const orNotFound = async (id: string) => {
  const outlet = await outletsDb.find(id)
  if (!outlet) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  return outlet
}

export const outletsService = {
  list: async () => outletsDb.list(),

  create: async (input: IOutletInput) => {
    if (await outletsDb.findByName(input.name)) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    return orNotFound(await outletsDb.create(input))
  },

  update: async (id: string, input: IOutletInput) => {
    await orNotFound(id)
    const twin = await outletsDb.findByName(input.name)
    if (twin && twin !== id) throw new HttpError(HttpStatus.BAD_REQUEST, NAME_TAKEN)
    await outletsDb.update(id, input)
    return orNotFound(id)
  },

  archive: async (id: string) => {
    await orNotFound(id)
    await outletsDb.archive(id)
    return { id }
  },

  stocks: async (productId: string) => {
    if (!(await productsDb.find(productId))) throw new HttpError(HttpStatus.NOT_FOUND, PRODUCT_MISSING)
    return stockDb.byOutlets(productId)
  },

  transfer: async (authorId: string, input: ITransferInput) => {
    if (input.fromOutletId === input.toOutletId) throw new HttpError(HttpStatus.BAD_REQUEST, SAME_OUTLET)
    await orNotFound(input.fromOutletId)
    await orNotFound(input.toOutletId)
    if (!(await productsDb.find(input.productId))) throw new HttpError(HttpStatus.NOT_FOUND, PRODUCT_MISSING)
    const available = await stockDb.outletQuantity(input.productId, input.fromOutletId)
    if (available < input.quantity) throw new HttpError(HttpStatus.BAD_REQUEST, NOT_ENOUGH)
    const note = input.note.length > 0 ? input.note : TRANSFER_OUT
    await stockDb.register(
      input.productId,
      StockMoveKind.WRITE_OFF,
      -input.quantity,
      0,
      note,
      authorId,
      input.fromOutletId,
    )
    await stockDb.register(
      input.productId,
      StockMoveKind.INCOME,
      input.quantity,
      0,
      input.note.length > 0 ? input.note : TRANSFER_IN,
      authorId,
      input.toOutletId,
    )
    return stockDb.byOutlets(input.productId)
  },
}
