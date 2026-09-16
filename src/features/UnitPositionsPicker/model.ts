import type { IUnit, IUnitAssignment } from '@/entities/unit'
import type { IPosition, IPositionInput } from '@/entities/position'
import type { IUser } from '@/entities/user'

export interface IProps {
  unit: IUnit | null
  positions: IPosition[]
  users: IUser[]
  pending: boolean
  error?: string
  onCreatePosition: (input: IPositionInput) => unknown
  onSubmit: (assignments: IUnitAssignment[]) => void
  onClose: () => void
}

export const TITLE = 'Должности и сотрудники'
export const DESCRIPTION = 'Отметьте должности, прикрепите сотрудников или создайте новую должность.'
export const EMPTY = 'Список должностей пуст — создайте первую должность выше.'
export const SEARCH_EMPTY = 'По вашему запросу ничего не найдено'
export const NEW_POSITION_PLACEHOLDER = 'Название новой должности...'
export const SEARCH_POSITION_PLACEHOLDER = 'Поиск по должностям...'
export const ADD_POSITION_LABEL = 'Создать'
export const NO_EMPLOYEE = '— Не назначен (вакансия) —'
export const EMPLOYEE_LABEL = 'Сотрудник:'
export const SUBMIT_LABEL = 'Сохранить'
export const CANCEL_LABEL = 'Отмена'
export const ESTIMATED_ITEM_HEIGHT = 64
