export interface ICountSheetLine {
  productId: string
  name: string
  barcode: string
  unit: string
  stock: number
  costPrice: number
}

export interface ICountResult {
  checked: number
  changed: number
  shortage: number
  surplus: number
}

export interface IProps {
  open: boolean
  lines: ICountSheetLine[]
  counted: Record<string, string>
  note: string
  result: ICountResult | null
  pending: boolean
  error?: string
  onCount: (productId: string, value: string) => void
  onNoteChange: (value: string) => void
  onPrint: () => void
  onSubmit: () => void
  onClose: () => void
}

export const TITLE = 'Инвентаризация'
export const DESCRIPTION = 'Впишите фактические остатки и проведите расхождения'
export const PRINT_LABEL = 'Печать ведомости'
export const SUBMIT_LABEL = 'Провести'
export const CLOSE_LABEL = 'Закрыть'
export const CANCEL_LABEL = 'Отмена'
export const NOTE_HINT = 'Комментарий к пересчёту'
export const FACT_HINT = 'Факт'
export const STOCK_LABEL = 'учёт'
export const FILLED_LABEL = 'Заполнено'
export const CHECKED_LABEL = 'Проверено'
export const CHANGED_LABEL = 'Расхождений'
export const SHORTAGE_LABEL = 'Недостача'
export const SURPLUS_LABEL = 'Излишки'
export const ESTIMATED_ROW_HEIGHT = 52
