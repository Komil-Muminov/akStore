export interface IProps {
  onCreate: (holderName: string) => void
  pending: boolean
}

export const PLACEHOLDER = 'Имя владельца пропуска'
export const SUBMIT_LABEL = 'Выдать'
