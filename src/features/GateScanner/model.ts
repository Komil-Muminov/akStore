import type { IFoundPass } from '@/entities/entry'

export interface IProps {
  code: string
  found: IFoundPass | null
  pending: boolean
  error?: string
  notice?: string
  onCodeChange: (value: string) => void
  onFind: () => void
  onCheckIn: () => void
  onCheckOut: () => void
  onReset: () => void
}

export const TITLE = 'Проходная'
export const DESCRIPTION = 'Отсканируйте QR-код пропуска или введите номер'
export const CODE_PLACEHOLDER = 'Номер пропуска, например GP-2026-000001'
export const FIND_LABEL = 'Найти'
export const CHECK_IN_LABEL = 'Отметить вход'
export const CHECK_OUT_LABEL = 'Отметить выход'
export const RESET_LABEL = 'Сбросить'
export const INSIDE_LABEL = 'На территории'
export const OUTSIDE_LABEL = 'Вне территории'
export const REVOKED_LABEL = 'Пропуск отозван'
export const EMPTY_TITLE = 'Пропуск не выбран'
export const EMPTY_HINT = 'Введите номер с бланка — сканер подставит его сам'
