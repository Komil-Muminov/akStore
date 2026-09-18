import { outletsDb, productsDb, stockDb, usersDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { AuditAction, StockMoveKind, type ICountInput, type IProduct } from '../types'
import { auditService } from './audit.service'
import { stocktakeHtml } from './stocktake.print'

const EMPTY_LINES = 'В ведомости нет позиций'
const COUNT_NOTE = 'Инвентаризация'

const round = (value: number) => Math.round(value * 1000) / 1000

const scopeOf = async (authorId: string, outletId: string | null) =>
  outletId ?? (await usersDb.outletOf(authorId)) ?? (await outletsDb.first())

export const stocktakeService = {
  sheet: async (authorId: string, outletId: string | null, categoryId: string | null) => {
    const scope = await scopeOf(authorId, outletId)
    const found = await productsDb.search({
      categoryId: categoryId ?? undefined,
      outletId: scope,
      page: 1,
      limit: 1000,
    })
    return found.items.map((product: IProduct) => ({
      productId: product.id,
      name: product.name,
      barcode: product.barcode,
      unit: product.unit,
      stock: product.stock,
      costPrice: product.costPrice,
    }))
  },

  printable: async (authorId: string, outletId: string | null, categoryId: string | null) => {
    const scope = await scopeOf(authorId, outletId)
    const lines = await stocktakeService.sheet(authorId, outletId, categoryId)
    const outlet = scope ? await outletsDb.find(scope) : null
    return stocktakeHtml(lines, outlet?.name ?? '')
  },

  apply: async (authorId: string, input: ICountInput, outletId: string | null = null) => {
    if (input.lines.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_LINES)
    const scope = await scopeOf(authorId, outletId)
    const note = input.note.length > 0 ? `${COUNT_NOTE}: ${input.note}` : COUNT_NOTE

    let changed = 0
    let shortage = 0
    let surplus = 0
    for (const line of input.lines) {
      const product = await productsDb.find(line.productId)
      if (!product) continue
      const current = scope ? await stockDb.outletQuantity(line.productId, scope) : product.stock
      const delta = round(line.counted - current)
      if (delta === 0) continue
      changed += 1
      if (delta < 0) shortage += Math.abs(delta) * product.costPrice
      else surplus += delta * product.costPrice
      await stockDb.register(line.productId, StockMoveKind.INVENTORY, delta, 0, note, authorId, scope)
    }

    await auditService.record(
      authorId,
      AuditAction.STOCKTAKE,
      note,
      scope ?? '',
      `позиций ${String(input.lines.length)}, расхождений ${String(changed)}`,
    )

    return {
      checked: input.lines.length,
      changed,
      shortage: Math.round(shortage * 100) / 100,
      surplus: Math.round(surplus * 100) / 100,
    }
  },
}
