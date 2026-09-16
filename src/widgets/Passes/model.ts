import { PassFilter } from '@/entities/pass'

export const HEADERS: Record<PassFilter, { title: string; description: string }> = {
  [PassFilter.ALL]: { title: 'Все пропуска', description: 'Полный список выданных пропусков' },
  [PassFilter.ACTIVE]: { title: 'Активные пропуска', description: 'По этим пропускам разрешён проход' },
  [PassFilter.REVOKED]: { title: 'Отозванные пропуска', description: 'Проход по этим пропускам запрещён' },
}

export const SEARCH_PLACEHOLDER = 'Поиск по имени'
export const COUNT_SUFFIX = ' шт.'
export const ERROR_TITLE = 'Не удалось загрузить пропуска'
export const ERROR_HINT = 'Проверьте, что сервер запущен (npm run dev), и повторите.'
export const RETRY_LABEL = 'Повторить'
export const INITIAL_FILTER = PassFilter.ALL
