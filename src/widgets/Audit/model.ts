export interface IAuditEntry {
  id: string
  actorName: string
  action: string
  entity: string
  entityId: string
  details: string
  createdAt: string
}

export interface IBackupFile {
  name: string
  size: number
  createdAt: string
}

export const TITLE = 'Журнал'
export const DESCRIPTION = 'Кто что менял и резервные копии базы'
export const BACKUP_LABEL = 'Создать копию'
export const BACKUPS_TITLE = 'Резервные копии'
export const EMPTY_TITLE = 'Записей пока нет'
export const EMPTY_HINT = 'Здесь появятся возвраты, изъятия и правки цен'
export const EMPTY_BACKUPS = 'Копий пока нет'
export const ALL_ACTIONS = 'Все действия'
export const ESTIMATED_ROW_HEIGHT = 64
export const KILOBYTE = 1024

export const ACTION_LABELS: Record<string, string> = {
  'product-archive': 'Товар убран',
  'product-price': 'Изменена цена',
  'sale-refund': 'Возврат чека',
  'cash-out': 'Изъятие из кассы',
  'category-delete': 'Удалена категория',
  'supplier-archive': 'Убран поставщик',
  'outlet-archive': 'Убрана точка',
  'debtor-archive': 'Убран должник',
  'import-apply': 'Загрузка товаров',
  'shift-close': 'Закрытие смены',
}

export const ACTION_OPTIONS = Object.entries(ACTION_LABELS).map(([id, label]) => ({ id, label }))
