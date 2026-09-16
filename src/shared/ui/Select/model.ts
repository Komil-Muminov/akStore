export interface ISelectOption {
  id: string
  label: string
  description?: string
  group?: string
  keywords?: string[]
}

export const EMPTY_LABEL = 'Ничего не найдено'
export const LIST_MAX_HEIGHT = 280
