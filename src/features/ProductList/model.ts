import type { IProduct } from '@/entities/product'

export interface IProps {
  products: IProduct[]
  onEdit: (product: IProduct) => void
  onStock: (product: IProduct) => void
  onArchive: (product: IProduct) => void
}

export const EMPTY_TITLE = 'Товаров пока нет'
export const EMPTY_HINT = 'Нажмите «Добавить товар», чтобы завести первый'
export const EDIT_TOOLTIP = 'Изменить'
export const STOCK_TOOLTIP = 'Приход и списание'
export const ARCHIVE_TOOLTIP = 'Убрать из продажи'
export const LOW_LABEL = 'Мало'
export const ESTIMATED_ROW_HEIGHT = 64
