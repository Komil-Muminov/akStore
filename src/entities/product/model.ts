export enum ProductUnit {
  PIECE = 'piece',
  KILOGRAM = 'kilogram',
}

export enum StockMoveKind {
  INCOME = 'income',
  WRITE_OFF = 'write-off',
  SALE = 'sale',
  REFUND = 'refund',
  INVENTORY = 'inventory',
}

export interface IProductInput {
  barcode: string
  name: string
  categoryId: string | null
  unit: ProductUnit
  costPrice: number
  salePrice: number
  vatRate: number
  markCode: string
}

export interface IProduct extends IProductInput {
  id: string
  categoryName: string
  stock: number
  isActive: boolean
}

export interface ICategory {
  id: string
  name: string
  productCount: number
}

export interface IStockMove {
  id: string
  productId: string
  productName: string
  kind: StockMoveKind
  quantity: number
  costPrice: number
  note: string
  authorName: string
  createdAt: string
}

export const UNIT_LABELS: Record<ProductUnit, string> = {
  [ProductUnit.PIECE]: 'шт',
  [ProductUnit.KILOGRAM]: 'кг',
}

export const MOVE_LABELS: Record<StockMoveKind, string> = {
  [StockMoveKind.INCOME]: 'Приход',
  [StockMoveKind.WRITE_OFF]: 'Списание',
  [StockMoveKind.SALE]: 'Продажа',
  [StockMoveKind.REFUND]: 'Возврат',
  [StockMoveKind.INVENTORY]: 'Инвентаризация',
}

export const VAT_OPTIONS = [
  { id: '0', label: 'Без НДС' },
  { id: '5', label: '5%' },
  { id: '14', label: '14%' },
  { id: '18', label: '18%' },
]

export const LOW_STOCK_LIMIT = 5
export const NO_CATEGORY = 'Без категории'
