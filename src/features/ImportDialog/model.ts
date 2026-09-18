export enum ImportAction {
  CREATE = 'create',
  UPDATE = 'update',
  FAILED = 'failed',
}

export interface IImportValues {
  barcode: string
  name: string
  category: string
  unit: string
  costPrice: number
  salePrice: number
  vatRate: number
  markCode: string
  stock: number
}

export interface IImportRow {
  line: number
  action: ImportAction
  error: string
  values: IImportValues
}

export interface IImportPreview {
  fileName: string
  rows: IImportRow[]
  total: number
  toCreate: number
  toUpdate: number
  failed: number
}

export interface IImportResult {
  created: number
  updated: number
  failed: number
  stocked: number
}

export interface IProps {
  open: boolean
  preview: IImportPreview | null
  result: IImportResult | null
  pending: boolean
  error?: string
  onDrop: (paths: string[]) => void
  onApply: () => void
  onTemplate: () => void
  onClose: () => void
}

export const TITLE = 'Загрузка товаров из файла'
export const DESCRIPTION = 'Excel или CSV: названия, цены, остатки'
export const DROP_TITLE = 'Перетащите файл сюда'
export const DROP_HINT = 'Поддерживаются .xlsx и .csv'
export const TEMPLATE_LABEL = 'Скачать шаблон'
export const APPLY_LABEL = 'Загрузить'
export const CLOSE_LABEL = 'Закрыть'
export const CANCEL_LABEL = 'Отмена'
export const CREATE_LABEL = 'Новых'
export const UPDATE_LABEL = 'Обновится'
export const FAILED_LABEL = 'С ошибками'
export const TOTAL_LABEL = 'Строк'
export const CREATED_RESULT = 'Создано'
export const UPDATED_RESULT = 'Обновлено'
export const STOCKED_RESULT = 'Оприходовано'
export const SKIPPED_RESULT = 'Пропущено'
export const ESTIMATED_ROW_HEIGHT = 44
export const PREVIEW_LIMIT = 200

export const ACTION_LABELS: Record<ImportAction, string> = {
  [ImportAction.CREATE]: 'новый',
  [ImportAction.UPDATE]: 'обновится',
  [ImportAction.FAILED]: 'ошибка',
}
