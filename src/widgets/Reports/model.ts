import { ReportPreset } from '@/entities/report'

export const TITLE = 'Отчёты'
export const DESCRIPTION = 'Статистика выдачи пропусков за период и выгрузка в Excel'
export const EXPORT_LABEL = 'Экспорт в Excel'
export const EXPORT_PENDING = 'Формируем файл…'
export const EXPORT_DONE_PREFIX = 'Сохранено: '
export const OPEN_FOLDER_LABEL = 'Открыть папку'
export const ERROR_TITLE = 'Не удалось загрузить отчёт'
export const ERROR_HINT = 'Проверьте, что сервер запущен, и повторите.'
export const RETRY_LABEL = 'Повторить'
export const INITIAL_PRESET = ReportPreset.MONTH
