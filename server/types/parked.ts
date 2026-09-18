export interface IParkedLine {
  productId: string
  name: string
  unit: string
  price: number
  quantity: number
  stock: number
  vatRate: number
  discount: number
}

export interface IParkedSale {
  id: string
  cashierName: string
  note: string
  total: number
  lines: IParkedLine[]
  createdAt: string
}

export interface IParkedSaleRow {
  id: string
  cashier_name: string
  note: string
  total: string
  lines: IParkedLine[]
  created_at: Date
}
