import type { ICredentials } from '@/entities/user'

export interface IProps {
  pending: boolean
  error?: string
  onSubmit: (credentials: ICredentials) => void
}

export const APP_NAME = 'gatePass'
export const TITLE = 'Вход в систему'
export const DESCRIPTION = 'Пропускная система организации'
export const LOGIN_LABEL = 'Логин'
export const LOGIN_PLACEHOLDER = 'Введите логин'
export const PASSWORD_LABEL = 'Пароль'
export const PASSWORD_PLACEHOLDER = 'Введите пароль'
export const SUBMIT_LABEL = 'Войти'
export const REQUIRED_HINT = 'Заполните логин и пароль'
