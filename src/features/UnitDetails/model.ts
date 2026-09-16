import type { IUnit } from '@/entities/unit'
import type { IPosition } from '@/entities/position'
import type { IUser } from '@/entities/user'

export interface IProps {
  unit: IUnit
  units: IUnit[]
  positions: IPosition[]
  users: IUser[]
  pending: boolean
  onAddChild: (parent: IUnit) => void
  onRename: (unit: IUnit) => void
  onEditPositions: (unit: IUnit) => void
  onDelete: (unit: IUnit) => void
  onClose: () => void
}

export const TITLE = 'Подразделение'
export const PATH_LABEL = 'Расположение'
export const POSITIONS_LABEL = 'Должности'
export const NO_POSITIONS = 'Должности не назначены'
export const CHILDREN_LABEL = 'Входит подразделений'
export const ADD_CHILD_PREFIX = 'Добавить: '
export const RENAME_LABEL = 'Переименовать'
export const EDIT_POSITIONS_LABEL = 'Назначить должности'
export const DELETE_LABEL = 'Удалить подразделение'
export const PATH_SEPARATOR = ' / '
