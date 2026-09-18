import type { IInvoiceLine, ISupplier } from '@/entities/supplier'
import type { IProduct } from '@/entities/product'

export interface IProps {
  open: boolean
  suppliers: ISupplier[]
  products: IProduct[]
  lines: IInvoiceLine[]
  supplierId: string | null
  paid: string
  note: string
  pending: boolean
  error?: string
  onSupplierChange: (id: string | null) => void
  onAddProduct: (id: string | null) => void
  onLineChange: (productId: string, quantity: number, costPrice: number) => void
  onLineRemove: (productId: string) => void
  onPaidChange: (value: string) => void
  onNoteChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export const TITLE = 'Приход по накладной'
export const DESCRIPTION = 'Поставщик, позиции и оплата'
export const SUPPLIER_LABEL = 'Поставщик'
export const PICK_SUPPLIER = 'Выберите поставщика'
export const ADD_PRODUCT_LABEL = 'Добавить товар'
export const PICK_PRODUCT = 'Товар из справочника'
export const QUANTITY_HINT = 'Кол-во'
export const COST_HINT = 'Закупка'
export const PAID_LABEL = 'Оплачено'
export const NOTE_LABEL = 'Комментарий'
export const TOTAL_LABEL = 'Итого по накладной'
export const SUBMIT_LABEL = 'Оприходовать'
export const CANCEL_LABEL = 'Отмена'
export const REMOVE_TOOLTIP = 'Убрать позицию'
export const EMPTY_HINT = 'Добавьте товары из справочника'
export const ESTIMATED_ROW_HEIGHT = 56
