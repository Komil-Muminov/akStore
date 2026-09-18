import type { IOutlet, IOutletStock } from '@/entities/outlet'
import type { IProduct } from '@/entities/product'

export interface IProps {
  open: boolean
  outlets: IOutlet[]
  products: IProduct[]
  stocks: IOutletStock[]
  productId: string | null
  pending: boolean
  error?: string
  onProductChange: (id: string | null) => void
  onSubmit: (fromOutletId: string, toOutletId: string, quantity: number, note: string) => void
  onClose: () => void
}

export const TITLE = 'Перемещение товара'
export const DESCRIPTION = 'Между торговыми точками'
export const PRODUCT_LABEL = 'Товар'
export const FROM_LABEL = 'Откуда'
export const TO_LABEL = 'Куда'
export const QUANTITY_LABEL = 'Количество'
export const NOTE_HINT = 'Комментарий'
export const SUBMIT_LABEL = 'Переместить'
export const CANCEL_LABEL = 'Отмена'
export const STOCKS_LABEL = 'Остатки по точкам'
export const PICK_PRODUCT_HINT = 'Выберите товар'
