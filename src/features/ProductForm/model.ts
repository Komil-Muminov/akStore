import { ProductUnit, type ICategory, type IProduct, type IProductInput } from '@/entities/product'

export interface IProps {
  open: boolean
  initial: IProduct | null
  categories: ICategory[]
  pending: boolean
  error?: string
  onSubmit: (input: IProductInput) => void
  onClose: () => void
}

export const CREATE_TITLE = 'Новый товар'
export const EDIT_TITLE = 'Изменить товар'
export const DESCRIPTION = 'Штрихкод, цены и категория'
export const NAME_LABEL = 'Название'
export const BARCODE_LABEL = 'Штрихкод'
export const BARCODE_HINT = 'Отсканируйте или оставьте пустым'
export const CATEGORY_LABEL = 'Категория'
export const UNIT_LABEL = 'Единица'
export const COST_LABEL = 'Цена закупки'
export const PRICE_LABEL = 'Цена продажи'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
export const NO_CATEGORY_OPTION = 'Без категории'

export const UNIT_OPTIONS = [
  { id: ProductUnit.PIECE, label: 'Штуки' },
  { id: ProductUnit.KILOGRAM, label: 'Килограммы' },
]

export const EMPTY_FORM: IProductInput = {
  barcode: '',
  name: '',
  categoryId: null,
  unit: ProductUnit.PIECE,
  costPrice: 0,
  salePrice: 0,
}
