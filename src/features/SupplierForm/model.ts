import type { ISupplier, ISupplierInput } from '@/entities/supplier'

export interface IProps {
  open: boolean
  initial: ISupplier | null
  pending: boolean
  error?: string
  onSubmit: (input: ISupplierInput) => void
  onClose: () => void
}

export const CREATE_TITLE = 'Новый поставщик'
export const EDIT_TITLE = 'Изменить поставщика'
export const DESCRIPTION = 'Название, телефон и заметка'
export const NAME_LABEL = 'Название'
export const PHONE_LABEL = 'Телефон'
export const NOTE_LABEL = 'Заметка'
export const NOTE_HINT = 'Например, «молочка по вторникам»'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
