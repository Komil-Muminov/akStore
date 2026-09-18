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
  isFavorite: boolean
  minStock: number
}

export interface IProduct extends IProductInput {
  id: string
  categoryName: string
  stock: number
  isActive: boolean
}

export interface IProductRow {
  id: string
  barcode: string | null
  name: string
  category_id: string | null
  category_name: string | null
  unit: ProductUnit
  cost_price: string
  sale_price: string
  stock: string
  vat_rate: string
  mark_code: string
  is_favorite: boolean
  min_stock: string
  is_active: boolean
}

export interface ICategory {
  id: string
  name: string
  productCount: number
}

export interface ICategoryRow {
  id: string
  name: string
  product_count: string
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

export interface IStockMoveRow {
  id: string
  product_id: string
  product_name: string
  kind: StockMoveKind
  quantity: string
  cost_price: string
  note: string
  author_name: string | null
  created_at: Date
}

export interface IStockInput {
  productId: string
  quantity: number
  costPrice: number
  note: string
}

export interface IProductSearchParams {
  query?: string
  categoryId?: string
  favorite?: boolean
  lowStock?: boolean
  outletId?: string | null
  page?: number
  limit?: number
}
