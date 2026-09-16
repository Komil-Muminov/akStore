import type { IReportSummary } from '@/entities/report'
import type { TIconName } from '@/shared/ui'

export interface IProps {
  summary: IReportSummary
}

export interface ITileSpec {
  key: 'issued' | 'active' | 'revoked' | 'uniqueHolders'
  label: string
  hint: string
  icon: TIconName
}

export const TILES: ITileSpec[] = [
  { key: 'issued', label: 'Выдано пропусков', hint: 'за период', icon: 'shieldCheck' },
  { key: 'active', label: 'Активных', hint: 'проход разрешён', icon: 'check' },
  { key: 'revoked', label: 'Отозвано', hint: 'проход запрещён', icon: 'shieldOff' },
  { key: 'uniqueHolders', label: 'Посетителей', hint: 'уникальных ФИО', icon: 'users' },
]
