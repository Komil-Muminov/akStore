import { PassFilter, type IPass } from '@/entities/pass'

export interface IProps {
  passes: IPass[]
  filter: PassFilter
  searching: boolean
  selectedId: string | null
  onSelect: (id: string) => void
  onRevoke: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (pass: IPass) => void
}

export const REVOKE_TOOLTIP = 'Отозвать пропуск'
export const RESTORE_TOOLTIP = 'Восстановить пропуск'
export const DELETE_TOOLTIP = 'Удалить пропуск'
export const OPEN_TOOLTIP = 'Открыть карточку'
export const HOST_PREFIX = 'к '
export const ISSUED_PREFIX = 'Выдан '
export const SEARCH_EMPTY_TITLE = 'Ничего не найдено'
export const SEARCH_EMPTY_TEXT = 'Попробуйте изменить запрос.'

export const EMPTY_STATES: Record<PassFilter, { title: string; text: string }> = {
  [PassFilter.ALL]: { title: 'Пропусков пока нет', text: 'Нажмите «Выдать пропуск» в шапке.' },
  [PassFilter.ACTIVE]: { title: 'Нет активных пропусков', text: 'Все выданные пропуска отозваны.' },
  [PassFilter.REVOKED]: { title: 'Нет отозванных пропусков', text: 'Отозванные пропуска появятся здесь.' },
}
