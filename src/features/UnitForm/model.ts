import type { IUnit, UnitType } from '@/entities/unit'

export interface IUnitFormState {
  mode: 'create' | 'rename'
  type: UnitType
  parent: IUnit | null
  unit?: IUnit
}

export interface IProps {
  state: IUnitFormState | null
  pending: boolean
  error?: string
  onSubmit: (name: string) => void
  onClose: () => void
}

export const CREATE_TITLE_PREFIX = 'Новое подразделение: '
export const RENAME_TITLE = 'Переименовать'
export const PARENT_PREFIX = 'Родитель: '
export const NAME_LABEL = 'Название'
export const NAME_PLACEHOLDER = 'Например: Управление кадров'
export const NAME_ERROR = 'Минимум 2 символа'
export const SUBMIT_CREATE = 'Создать'
export const SUBMIT_RENAME = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
