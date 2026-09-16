import type { IPass } from '../types'
import { chatService } from './chat.service'

const HEADER = 'К вам посетитель'
const FIELD_SEPARATOR = '\n'
const VALUE_SEPARATOR = ': '
const ORGANIZATION_LABEL = 'Организация'
const PURPOSE_LABEL = 'Цель визита'
const PHONE_LABEL = 'Телефон'
const CAR_LABEL = 'Автомобиль'

const lineOf = (label: string, value: string) =>
  value.trim().length > 0 ? `${label}${VALUE_SEPARATOR}${value}` : ''

export const passNoticeOf = (pass: IPass) =>
  [
    `${HEADER}${VALUE_SEPARATOR}${pass.holderName}`,
    lineOf(ORGANIZATION_LABEL, pass.organization),
    lineOf(PURPOSE_LABEL, pass.purpose),
    lineOf(PHONE_LABEL, pass.phone),
    lineOf(CAR_LABEL, pass.carPlate),
  ]
    .filter((line) => line.length > 0)
    .join(FIELD_SEPARATOR)

export const notifyHost = async (authorId: string, pass: IPass) => {
  if (!pass.hostUserId || pass.hostUserId === authorId) return
  try {
    const conversation = await chatService.openDirect(authorId, pass.hostUserId)
    await chatService.send(authorId, conversation.id, passNoticeOf(pass))
  } catch (error) {
    console.error('Не удалось уведомить принимающего', error)
  }
}
