import type { ITopProduct } from '@/entities/report'

export interface IProps {
  products: ITopProduct[]
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export const TITLE = 'Топ товаров (ABC-анализ)'
export const EMPTY_HINT = 'Продаж за период нет'
export const QUANTITY_LABEL = 'продано'
export const PROFIT_LABEL = 'прибыль'
export const SHARE_LABEL = 'выручки'
export const ESTIMATED_ROW_HEIGHT = 56
export const ABC_TOOLTIP: Record<string, string> = {
  A: 'Группа A (Хиты): товары дают 80% общей выручки',
  B: 'Группа B (Стабильные): товары дают 15% общей выручки',
  C: 'Группа C (Неликвид): товары дают 5% общей выручки',
}
