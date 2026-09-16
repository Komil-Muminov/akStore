import {
  ConversationKind,
  MEMBERS_FORMS,
  SIZE_UNITS,
  UNREAD_LIMIT,
  UNREAD_OVERFLOW,
  type IConversation,
  type IMessage,
} from './model'

const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const DAY_OPTIONS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
const LOCALE = 'ru-RU'
const TODAY_LABEL = 'Сегодня'
const YESTERDAY_LABEL = 'Вчера'
const DAY_MS = 86_400_000
const AUTHOR_SEPARATOR = ': '
const TEEN_FROM = 11
const TEEN_TO = 14
const DECADE = 10
const HUNDRED = 100

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

export const isGroup = (conversation: IConversation) => conversation.kind === ConversationKind.GROUP

export const titleOf = (conversation: IConversation) =>
  isGroup(conversation) ? conversation.title : conversation.companionName || conversation.companionLogin

export const membersLabelOf = (count: number) => {
  const tail = count % HUNDRED
  const last = count % DECADE
  const form =
    tail >= TEEN_FROM && tail <= TEEN_TO
      ? MEMBERS_FORMS[2]
      : last === 1
        ? MEMBERS_FORMS[0]
        : last >= 2 && last <= 4
          ? MEMBERS_FORMS[1]
          : MEMBERS_FORMS[2]
  return `${String(count)} ${form ?? ''}`
}

export const previewOf = (conversation: IConversation) =>
  isGroup(conversation) && conversation.lastMessageAuthor.length > 0
    ? `${conversation.lastMessageAuthor}${AUTHOR_SEPARATOR}${conversation.lastMessage}`
    : conversation.lastMessage

export const isReadByCompanion = (message: IMessage, conversation: IConversation) =>
  conversation.companionReadAt !== null &&
  new Date(message.createdAt).getTime() <= new Date(conversation.companionReadAt).getTime()

const SIZE_STEP = 1024
const SIZE_PRECISION = 1

export const fileSizeOf = (bytes: number) => {
  let value = bytes
  let unit = 0
  while (value >= SIZE_STEP && unit < SIZE_UNITS.length - 1) {
    value /= SIZE_STEP
    unit += 1
  }
  const rounded = unit === 0 ? String(value) : value.toFixed(SIZE_PRECISION)
  return `${rounded} ${SIZE_UNITS[unit] ?? ''}`
}

export const hasFile = (message: IMessage) => message.fileName.length > 0 && !message.isDeleted
