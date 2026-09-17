export interface ISelectOption {
  id: string
  label: string
  description?: string
  group?: string
  keywords?: string[]
}

export interface ISelectManage {
  onCreate: (name: string) => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

export const EMPTY_LABEL = 'Ничего не найдено'
export const CREATE_PREFIX = 'Создать'
export const MANAGE_LABEL = 'Изменить список'
export const MANAGE_DONE_LABEL = 'Готово'
export const CREATE_NAME_MAX = 24
export const ELLIPSIS = '…'
export const NEW_HINT = 'Введите название'
export const SAVE_TOOLTIP = 'Сохранить'
export const REMOVE_TOOLTIP = 'Удалить'
export const CONFIRM_TOOLTIP = 'Точно удалить'
export const CANCEL_TOOLTIP = 'Отменить'
export const LIST_MAX_HEIGHT = 280
