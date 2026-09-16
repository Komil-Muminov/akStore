import type { IUnit } from '@/entities/unit'
import type { IPosition } from '@/entities/position'

export interface IProps {
  unit: IUnit | null
  positions: IPosition[]
  pending: boolean
  error?: string
  onSubmit: (positionIds: string[]) => void
  onClose: () => void
}

export const TITLE = 'Должности подразделения'
export const DESCRIPTION = 'Отметьте должности, которые есть в этом подразделении.'
export const EMPTY = 'Справочник должностей пуст — добавьте должности через «Должности» в панели инструментов.'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
export const RANK_PREFIX = 'ранг '
