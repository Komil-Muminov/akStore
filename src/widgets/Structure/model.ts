export const TITLE = 'Структура'
export const DESCRIPTION = 'Руководство → Управления → Отделы → Секторы. Перетаскивайте узлы, чтобы перестроить.'
export const AUTO_LAYOUT_LABEL = 'Автораскладка'
export const POSITIONS_LABEL = 'Должности'
export const ADD_MANAGEMENT_LABEL = 'Добавить управление'
export const ERROR_TITLE = 'Не удалось загрузить структуру'
export const ERROR_HINT = 'Проверьте, что сервер запущен (npm run dev), и повторите.'
export const RETRY_LABEL = 'Повторить'

export const DELETE_DIALOG = {
  title: 'Удалить подразделение?',
  text: 'Подразделение будет удалено. Дочерние подразделения нужно удалить или перенести заранее.',
  confirm: 'Удалить',
  cancel: 'Отмена',
}

export const DELETE_POSITION_DIALOG = {
  title: 'Удалить должность?',
  text: 'Должность исчезнет из справочника. Если она назначена в подразделениях — сервер откажет.',
  confirm: 'Удалить',
  cancel: 'Отмена',
}
