export interface IProps {
  value: string
  disabled: boolean
  pending: boolean
  editing: boolean
  error?: string
  onChange: (value: string) => void
  onSend: () => void
  onCancelEdit: () => void
}

export const PLACEHOLDER = 'Написать сообщение'
export const SEND_TOOLTIP = 'Отправить'
export const SAVE_TOOLTIP = 'Сохранить изменения'
export const CANCEL_TOOLTIP = 'Отменить правку'
export const EDIT_HINT = 'Правка сообщения'
