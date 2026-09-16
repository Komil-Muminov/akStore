import type { IUserInput, UserRole } from '@/entities/user'

export interface IProps {
  open: boolean
  roles: UserRole[]
  pending: boolean
  error?: string
  onSubmit: (input: IUserInput) => void
  onClose: () => void
}

export const TITLE = 'Новый пользователь'
export const DESCRIPTION = 'Логин и пароль передайте пользователю — он сможет сменить пароль после входа.'
export const ROLE_LABEL = 'Роль'
export const NAME_LABEL = 'ФИО'
export const NAME_PLACEHOLDER = 'Иванов Иван Иванович'
export const LOGIN_LABEL = 'Логин'
export const LOGIN_PLACEHOLDER = 'ivanov'
export const PASSWORD_LABEL = 'Пароль'
export const SUBMIT_LABEL = 'Создать'
export const CANCEL_LABEL = 'Отмена'
export const NAME_ERROR = 'Минимум 2 символа'
export const LOGIN_ERROR = 'Латиница, цифры, точка или дефис, минимум 2 символа'
export const PASSWORD_ERROR = 'Минимум 3 символа'
export const LOGIN_PATTERN = /^[a-z0-9._-]+$/i
