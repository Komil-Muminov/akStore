import type { IProduct } from '@/entities/product'

export interface IProps {
  products: IProduct[]
  onPick: (product: IProduct) => void
}

export const TITLE = 'Быстрые кнопки'
export const PICKS_LIMIT = 12
