export interface IOutlet {
  id: string
  name: string
  address: string
  phone: string
  productCount: number
  stockValue: number
}

export interface IOutletRow {
  id: string
  name: string
  address: string
  phone: string
  product_count: string
  stock_value: string
}

export interface IOutletInput {
  name: string
  address: string
  phone: string
}

export interface ITransferInput {
  productId: string
  fromOutletId: string
  toOutletId: string
  quantity: number
  note: string
}

export interface IOutletStock {
  outletId: string
  outletName: string
  quantity: number
}

export interface IOutletStockRow {
  outlet_id: string
  outlet_name: string
  quantity: string
}
