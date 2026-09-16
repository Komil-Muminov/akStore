export type TPasswordMode = 'change' | 'reset'

export interface IPasswordSubmit {
  current: string
  next: string
}

export interface IProps {
  mode: TPasswordMode | null
  subject?: string
  pending: boolean
  error?: string
  onSubmit: (values: IPasswordSubmit) => void
  onClose: () => void
}

export const TITLES: Record<TPasswordMode, string> = {
  change: 'Сменить пароль',
  reset: 'Задать новый пароль',
}
export const CURRENT_LABEL = 'Текущий пароль'
export const NEXT_LABEL = 'Новый пароль'
export const REPEAT_LABEL = 'Повторите новый пароль'
export const MISMATCH = 'Пароли не совпадают'
export const TOO_SHORT = 'Минимум 3 символа'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
