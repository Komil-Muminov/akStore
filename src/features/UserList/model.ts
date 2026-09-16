import type { IUser } from '@/entities/user'

export interface IProps {
  users: IUser[]
  onResetPassword: (user: IUser) => void
  onToggleActive: (user: IUser) => void
  onDelete: (user: IUser) => void
}

export const EMPTY_TITLE = 'Пользователей пока нет'
export const EMPTY_TEXT = 'Нажмите «Добавить пользователя», чтобы создать учётную запись.'
export const RESET_TOOLTIP = 'Задать новый пароль'
export const DEACTIVATE_TOOLTIP = 'Отключить доступ'
export const ACTIVATE_TOOLTIP = 'Включить доступ'
export const DELETE_TOOLTIP = 'Удалить учётную запись'
export const ACTIVE_LABEL = 'Активен'
export const INACTIVE_LABEL = 'Отключён'
export const LOGIN_PREFIX = '@'
