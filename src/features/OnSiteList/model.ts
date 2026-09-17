import type { IOnSite, IPassEntry } from '@/entities/entry'

export interface IProps {
  people: IOnSite[]
  entries: IPassEntry[]
}

export const ON_SITE_TITLE = 'Сейчас на территории'
export const JOURNAL_TITLE = 'Журнал проходов'
export const JOURNAL_EMPTY = 'Отметок пока нет'
export const SINCE_LABEL = 'с'
export const ESTIMATED_ROW_HEIGHT = 56
