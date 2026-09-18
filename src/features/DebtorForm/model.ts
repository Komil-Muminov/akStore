import type { IDebtor, IDebtorInput } from '@/entities/debt'

export interface IProps {
  open: boolean
  initial: IDebtor | null
  pending: boolean
  error?: string
  onSubmit: (input: IDebtorInput) => void
  onClose: () => void
}

export const CREATE_TITLE = 'Новый должник'
export const EDIT_TITLE = 'Изменить должника'
export const DESCRIPTION = 'Имя, телефон и заметка'
export const NAME_LABEL = 'Имя'
export const PHONE_LABEL = 'Телефон'
export const NOTE_LABEL = 'Заметка'
export const NOTE_HINT = 'Например, «дом напротив»'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
