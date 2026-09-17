import type { IProduct } from '@/entities/product'

export enum StockAction {
  INCOME = 'income',
  WRITE_OFF = 'write-off',
  INVENTORY = 'inventory',
}

export interface IStockSubmit {
  action: StockAction
  productId: string
  quantity: number
  costPrice: number
  note: string
}

export interface IProps {
  product: IProduct | null
  pending: boolean
  error?: string
  onSubmit: (values: IStockSubmit) => void
  onClose: () => void
}

export const TITLE = 'Движение товара'
export const QUANTITY_LABEL = 'Количество'
export const COST_LABEL = 'Цена закупки'
export const NOTE_LABEL = 'Комментарий'
export const SUBMIT_LABEL = 'Провести'
export const CANCEL_LABEL = 'Отмена'
export const CURRENT_LABEL = 'Текущий остаток'

export const ACTION_OPTIONS = [
  { id: StockAction.INCOME, label: 'Приход' },
  { id: StockAction.WRITE_OFF, label: 'Списание' },
  { id: StockAction.INVENTORY, label: 'Инвентаризация (факт)' },
]
