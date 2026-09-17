import type { ITopProduct } from '@/entities/report'

export interface IProps {
  products: ITopProduct[]
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export const TITLE = 'Топ товаров'
export const EMPTY_HINT = 'Продаж за период нет'
export const QUANTITY_LABEL = 'продано'
export const PROFIT_LABEL = 'прибыль'
export const ESTIMATED_ROW_HEIGHT = 56
