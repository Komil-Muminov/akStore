import type { ICategory, IProduct } from '@/entities/product'

export interface IProps {
  query: string
  products: IProduct[]
  categories: ICategory[]
  activeCategory: string | null
  loading: boolean
  error?: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
  onCategoryChange: (id: string | null) => void
  onPick: (product: IProduct) => void
}

export const SEARCH_PLACEHOLDER = 'Отсканируйте штрихкод или введите название'
export const ALL_CATEGORIES = 'Все'
export const EMPTY_TITLE = 'Ничего не найдено'
export const EMPTY_HINT = 'Проверьте название или заведите товар в разделе «Товары»'
export const OUT_OF_STOCK = 'Нет в наличии'
export const ESTIMATED_TILE_HEIGHT = 84
