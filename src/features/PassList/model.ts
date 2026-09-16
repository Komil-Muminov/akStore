import type { IPass } from '@/entities/pass'

export interface IProps {
  passes: IPass[]
  onDeactivate: (id: string) => void
}

export const EMPTY_LABEL = 'Пропусков пока нет'
export const DEACTIVATE_LABEL = 'Деактивировать'
