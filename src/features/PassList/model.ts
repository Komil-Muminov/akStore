import { PassFilter, type IPass } from '@/entities/pass'

export interface IProps {
  passes: IPass[]
  filter: PassFilter
  searching: boolean
  onDeactivate: (id: string) => void
}

export const REVOKE_TOOLTIP = 'Отозвать пропуск — проход будет запрещён'
export const ISSUED_PREFIX = 'Выдан '
export const SEARCH_EMPTY_TITLE = 'Ничего не найдено'
export const SEARCH_EMPTY_TEXT = 'Попробуйте изменить запрос.'

export const EMPTY_STATES: Record<PassFilter, { title: string; text: string }> = {
  [PassFilter.ALL]: { title: 'Пропусков пока нет', text: 'Выдайте первый пропуск через форму выше.' },
  [PassFilter.ACTIVE]: { title: 'Нет активных пропусков', text: 'Все выданные пропуска отозваны.' },
  [PassFilter.REVOKED]: { title: 'Нет отозванных пропусков', text: 'Отозванные пропуска появятся здесь.' },
}
