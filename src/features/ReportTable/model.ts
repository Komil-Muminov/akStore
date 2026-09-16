import type { IPass } from '@/entities/pass'

export interface IProps {
  passes: IPass[]
}

export const TITLE = 'Пропуска за период'
export const EMPTY = 'Пропусков за период нет'
export const COUNT_SUFFIX = ' шт.'
export const HOST_PREFIX = 'к '
export const ESTIMATED_ROW_HEIGHT = 56
