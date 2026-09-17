import type { ICartLine } from '@/entities/sale'

export interface IProps {
  lines: ICartLine[]
  discount: number
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onDiscountChange: (value: number) => void
  onClear: () => void
}

export const CART_TITLE = 'Чек'
export const EMPTY_TITLE = 'Чек пуст'
export const EMPTY_HINT = 'Отсканируйте товар или найдите его в списке'
export const SUBTOTAL_LABEL = 'Сумма'
export const DISCOUNT_LABEL = 'Скидка'
export const TOTAL_LABEL = 'Итого'
export const VAT_ROW_LABEL = 'в т. ч. НДС'
export const CLEAR_TOOLTIP = 'Очистить чек'
export const REMOVE_TOOLTIP = 'Убрать позицию'
export const PLUS_TOOLTIP = 'Добавить'
export const MINUS_TOOLTIP = 'Убавить'
export const ESTIMATED_LINE_HEIGHT = 64
export const QUANTITY_STEP = 1
