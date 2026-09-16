export interface IProps {
  onCreate: (holderName: string) => void
  pending: boolean
  error?: string
}

export const TITLE = 'Выдать новый пропуск'
export const DESCRIPTION = 'Укажите имя владельца — пропуск сразу станет активным и появится в списке.'
export const PLACEHOLDER = 'Например: Иванов Иван'
export const SUBMIT_LABEL = 'Выдать пропуск'
export const HINT_TOO_SHORT = 'Введите минимум 2 символа'
export const HINT_READY = 'Нажмите Enter или кнопку'
