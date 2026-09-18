import type { ICartLine } from '@/entities/sale'

export interface IProps {
  lines: ICartLine[]
  discount: number
  discountKind: string
  onQuantityChange: (productId: string, quantity: number) => void
  onLineDiscountChange: (productId: string, value: number) => void
  onRemove: (productId: string) => void
  onDiscountChange: (value: number) => void
  onDiscountKindChange: (value: string | null) => void
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
export const ESTIMATED_LINE_HEIGHT = 72
export const QUANTITY_HINT = 'Кол-во'
export const LINE_DISCOUNT_HINT = 'Скидка'
export const QUANTITY_STEP = 1
