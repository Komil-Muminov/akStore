export interface IProps {
  value: string
  disabled: boolean
  pending: boolean
  error?: string
  onChange: (value: string) => void
  onSend: () => void
}

export const PLACEHOLDER = 'Написать сообщение'
export const SEND_TOOLTIP = 'Отправить'
