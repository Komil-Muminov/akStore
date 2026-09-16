import { PassFilter, type IPass } from '@/entities/pass'
import type { TFormMode } from '@/features/PassForm'

export interface IFormState {
  mode: TFormMode | null
  pass?: IPass
}

export const CLOSED_FORM: IFormState = { mode: null }

export const HEADERS: Record<PassFilter, { title: string; description: string }> = {
  [PassFilter.ALL]: { title: 'Все пропуска', description: 'Полный список выданных пропусков' },
  [PassFilter.ACTIVE]: { title: 'Активные пропуска', description: 'По этим пропускам разрешён проход' },
  [PassFilter.REVOKED]: { title: 'Отозванные пропуска', description: 'Проход по этим пропускам запрещён' },
}

export const SEARCH_PLACEHOLDER = 'Поиск: имя, к кому, организация, госномер'
export const CREATE_LABEL = 'Выдать пропуск'
export const COUNT_SUFFIX = ' шт.'
export const ERROR_TITLE = 'Не удалось загрузить пропуска'
export const ERROR_HINT = 'Проверьте, что сервер запущен (npm run dev), и повторите.'
export const RETRY_LABEL = 'Повторить'
export const INITIAL_FILTER = PassFilter.ALL

export const DELETE_DIALOG = {
  title: 'Удалить пропуск?',
  text: 'Пропуск будет удалён без возможности восстановления. Если нужно только запретить проход — используйте «Отозвать».',
  confirm: 'Удалить',
  cancel: 'Отмена',
}
