import type { IOutlet, IOutletInput } from '@/entities/outlet'

export interface IProps {
  open: boolean
  initial: IOutlet | null
  pending: boolean
  error?: string
  onSubmit: (input: IOutletInput) => void
  onClose: () => void
}

export const CREATE_TITLE = 'Новая точка'
export const EDIT_TITLE = 'Изменить точку'
export const DESCRIPTION = 'Название, адрес и телефон магазина'
export const NAME_LABEL = 'Название'
export const ADDRESS_LABEL = 'Адрес'
export const PHONE_LABEL = 'Телефон'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
