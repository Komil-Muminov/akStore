import type { ISale } from '@/entities/sale'

export interface IProps {
  sales: ISale[]
  page: number
  totalPages: number
  total: number
  loading: boolean
  onPageChange: (page: number) => void
  onPrint: (sale: ISale) => void
}

export const TITLE = 'Чеки'
export const EMPTY_TITLE = 'Чеков не найдено'
export const EMPTY_HINT = 'Измените период или условия поиска'
export const REFUNDED_LABEL = 'Возврат'
export const POSITIONS_LABEL = 'поз.'
export const PRINT_TOOLTIP = 'Печать чека'
export const ESTIMATED_ROW_HEIGHT = 64
