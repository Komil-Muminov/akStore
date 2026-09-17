import { LOW_STOCK_LIMIT, UNIT_LABELS, type IProduct, type ProductUnit } from './model'

const LOCALE = 'ru-RU'
const CURRENCY_OPTIONS: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
const QUANTITY_OPTIONS: Intl.NumberFormatOptions = { maximumFractionDigits: 3 }
const PERCENT = 100

export const moneyOf = (value: number) => value.toLocaleString(LOCALE, CURRENCY_OPTIONS)

export const quantityOf = (value: number) => value.toLocaleString(LOCALE, QUANTITY_OPTIONS)

export const stockLabelOf = (product: IProduct) =>
  `${quantityOf(product.stock)} ${UNIT_LABELS[product.unit]}`

export const unitLabelOf = (unit: ProductUnit) => UNIT_LABELS[unit]

export const isLowStock = (product: IProduct) => product.stock <= LOW_STOCK_LIMIT

export const marginOf = (product: IProduct) =>
  product.salePrice > 0 ? Math.round(((product.salePrice - product.costPrice) / product.salePrice) * PERCENT) : 0
