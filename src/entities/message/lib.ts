import { UNREAD_LIMIT, UNREAD_OVERFLOW, type IMessage } from './model'

const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const DAY_OPTIONS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
const LOCALE = 'ru-RU'
const TODAY_LABEL = 'Сегодня'
const YESTERDAY_LABEL = 'Вчера'
const DAY_MS = 86_400_000

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()

export const timeOf = (iso: string) => new Date(iso).toLocaleTimeString(LOCALE, TIME_OPTIONS)

export const dayLabelOf = (iso: string) => {
  const target = startOfDay(new Date(iso))
  const today = startOfDay(new Date())
  if (target === today) return TODAY_LABEL
  if (target === today - DAY_MS) return YESTERDAY_LABEL
  return new Date(iso).toLocaleDateString(LOCALE, DAY_OPTIONS)
}

export const unreadLabelOf = (count: number) => (count > UNREAD_LIMIT ? UNREAD_OVERFLOW : String(count))

export const isDayStart = (message: IMessage, previous?: IMessage) =>
  previous === undefined || dayLabelOf(message.createdAt) !== dayLabelOf(previous.createdAt)
