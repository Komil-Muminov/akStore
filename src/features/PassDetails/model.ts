import type { IPass, TPassField } from '@/entities/pass'
import type { TIconName } from '@/shared/ui'

export interface IProps {
  pass: IPass
  pending: boolean
  onEdit: (pass: IPass) => void
  onRevoke: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (pass: IPass) => void
  onClose: () => void
}

export interface IDetailSpec {
  name: TPassField
  icon: TIconName
}

export const TITLE = 'Карточка пропуска'
export const EMPTY_VALUE = '—'
export const ISSUED_LABEL = 'Выдан'
export const UPDATED_LABEL = 'Изменён'
export const EDIT_LABEL = 'Редактировать'
export const REVOKE_LABEL = 'Отозвать'
export const RESTORE_LABEL = 'Восстановить'
export const DELETE_LABEL = 'Удалить'

export const DETAIL_ROWS: IDetailSpec[] = [
  { name: 'hostName', icon: 'users' },
  { name: 'organization', icon: 'building' },
  { name: 'purpose', icon: 'target' },
  { name: 'phone', icon: 'phone' },
  { name: 'carPlate', icon: 'car' },
]
