import { ImportAction, ProductUnit, type IImportRow, type IImportValues } from '../types'

const HEADER_OFFSET = 2
const MONEY_MAX = 99_999_999
const VAT_MAX = 100
const NAME_MAX = 120
const KILOGRAM_ALIASES = ['кг', 'килограмм', 'kg', 'kilogram']

const NAME_ERROR = 'Не указано название'
const PRICE_ERROR = 'Цена продажи указана неверно'

const numberOf = (raw: string) => {
  const parsed = Number(raw.replace(',', '.').replace(/\s/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const unitOf = (raw: string) =>
  KILOGRAM_ALIASES.includes(raw.trim().toLowerCase()) ? ProductUnit.KILOGRAM : ProductUnit.PIECE

const valuesOf = (cells: string[], headers: Map<number, string>): IImportValues => {
  const pick = (field: string) => {
    const index = [...headers.entries()].find(([, name]) => name === field)?.[0]
    return index === undefined ? '' : (cells[index] ?? '').trim()
  }
  return {
    barcode: pick('barcode'),
    name: pick('name').slice(0, NAME_MAX),
    category: pick('category'),
    unit: unitOf(pick('unit')),
    costPrice: Math.min(Math.max(numberOf(pick('costPrice')), 0), MONEY_MAX),
    salePrice: Math.min(Math.max(numberOf(pick('salePrice')), 0), MONEY_MAX),
    vatRate: Math.min(Math.max(numberOf(pick('vatRate')), 0), VAT_MAX),
    markCode: pick('markCode'),
    stock: Math.max(numberOf(pick('stock')), 0),
  }
}

const errorOf = (values: IImportValues) => {
  if (values.name.length === 0) return NAME_ERROR
  if (values.salePrice <= 0) return PRICE_ERROR
  return ''
}

export const rowsOf = (body: string[][], headers: Map<number, string>): IImportRow[] =>
  body.map((cells, index) => {
    const values = valuesOf(cells, headers)
    const error = errorOf(values)
    return {
      line: index + HEADER_OFFSET,
      action: error.length > 0 ? ImportAction.FAILED : ImportAction.CREATE,
      error,
      values,
    }
  })
