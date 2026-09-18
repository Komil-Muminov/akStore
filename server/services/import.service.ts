import { categoriesDb, productsDb, stockDb } from '../db'
import { removeUpload, uploadsPathOf } from '../shared/uploads'
import { HttpError, HttpStatus } from '../shared/utils'
import { ImportAction, StockMoveKind, type IImportRow, type IImportValues } from '../types'
import { tableOf } from './import.parse'
import { rowsOf } from './import.rows'

const EMPTY_FILE = 'В файле нет строк с товарами'
const NO_COLUMNS = 'Не найдены колонки «Название» и «Цена продажи»'
const IMPORT_NOTE = 'Загрузка из файла'

const existingOf = async (values: IImportValues) => {
  if (values.barcode.length > 0) return productsDb.findByBarcode(values.barcode)
  return productsDb.findByName(values.name)
}

const markActions = async (rows: IImportRow[]) => {
  for (const row of rows) {
    if (row.action === ImportAction.FAILED) continue
    const existing = await existingOf(row.values)
    row.action = existing ? ImportAction.UPDATE : ImportAction.CREATE
  }
  return rows
}

const readRows = async (fileName: string) => {
  const { headers, body } = await tableOf(uploadsPathOf(fileName))
  const fields = [...headers.values()]
  if (!fields.includes('name') || !fields.includes('salePrice')) {
    throw new HttpError(HttpStatus.BAD_REQUEST, NO_COLUMNS)
  }
  if (body.length === 0) throw new HttpError(HttpStatus.BAD_REQUEST, EMPTY_FILE)
  return markActions(rowsOf(body, headers))
}

const categoryIdOf = async (name: string) => {
  if (name.trim().length === 0) return null
  const existing = await categoriesDb.findByName(name)
  return existing ?? (await categoriesDb.create(name.trim()))
}

const inputOf = (values: IImportValues, categoryId: string | null) => ({
  barcode: values.barcode,
  name: values.name,
  categoryId,
  unit: values.unit,
  costPrice: values.costPrice,
  salePrice: values.salePrice,
  vatRate: values.vatRate,
  markCode: values.markCode,
  isFavorite: false,
  minStock: 0,
})

export const importService = {
  preview: async (fileName: string) => {
    const rows = await readRows(fileName)
    return {
      fileName,
      rows,
      total: rows.length,
      toCreate: rows.filter((row) => row.action === ImportAction.CREATE).length,
      toUpdate: rows.filter((row) => row.action === ImportAction.UPDATE).length,
      failed: rows.filter((row) => row.action === ImportAction.FAILED).length,
    }
  },

  apply: async (authorId: string, fileName: string) => {
    const rows = await readRows(fileName)
    let created = 0
    let updated = 0
    let stocked = 0
    for (const row of rows) {
      if (row.action === ImportAction.FAILED) continue
      const categoryId = await categoryIdOf(row.values.category)
      const existing = await existingOf(row.values)
      const input = inputOf(row.values, categoryId)
      const productId = existing ? existing.id : await productsDb.create(input)
      if (existing) {
        await productsDb.update(existing.id, input)
        updated += 1
      } else {
        created += 1
      }
      if (row.values.stock > 0) {
        await stockDb.register(
          productId,
          StockMoveKind.INCOME,
          row.values.stock,
          row.values.costPrice,
          IMPORT_NOTE,
          authorId,
        )
        stocked += 1
      }
    }
    removeUpload(fileName)
    return { created, updated, failed: rows.filter((row) => row.action === ImportAction.FAILED).length, stocked }
  },
}
