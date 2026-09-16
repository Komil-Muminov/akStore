export interface IProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export const PREV_LABEL = 'Назад'
export const NEXT_LABEL = 'Вперёд'
export const TOTAL_LABEL = 'Всего:'
export const PAGE_PREFIX = 'Стр.'
export const PAGE_OF = 'из'
