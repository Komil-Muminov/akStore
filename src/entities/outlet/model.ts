export interface IOutlet {
  id: string
  name: string
  address: string
  phone: string
  productCount: number
  stockValue: number
}

export interface IOutletInput {
  name: string
  address: string
  phone: string
}

export interface IOutletStock {
  outletId: string
  outletName: string
  quantity: number
}

export interface ITransferInput {
  productId: string
  fromOutletId: string
  toOutletId: string
  quantity: number
  note: string
}

export const EMPTY_OUTLET: IOutletInput = { name: '', address: '', phone: '' }
export const ALL_OUTLETS_LABEL = 'Все точки'
