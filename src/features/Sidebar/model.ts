import { PassFilter } from '@/entities/pass'
import type { TIconName } from '@/shared/ui'

export interface INavItem {
  id: PassFilter
  label: string
  hint: string
  icon: TIconName
}

export interface IProps {
  active: PassFilter
  counts: Record<PassFilter, number>
  onSelect: (filter: PassFilter) => void
}

export const APP_NAME = 'gatePass'
export const APP_TAGLINE = 'Пропускная система'
export const NAV_SECTION = 'Пропуска'

export const NAV_ITEMS: INavItem[] = [
  { id: PassFilter.ALL, label: 'Все пропуска', hint: 'Полный список', icon: 'listChecks' },
  { id: PassFilter.ACTIVE, label: 'Активные', hint: 'Разрешён проход', icon: 'shieldCheck' },
  { id: PassFilter.REVOKED, label: 'Отозванные', hint: 'Проход запрещён', icon: 'shieldOff' },
]

export const FOOTER_HINT = 'Enter в форме — выдать пропуск'
