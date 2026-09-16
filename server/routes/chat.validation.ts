import { HttpError, HttpStatus, requireString, requireUuid } from '../shared/utils'
import type { IGroupInput } from '../types'

const BODY_MIN = 1
const BODY_MAX = 4000
const TITLE_MIN = 2
const TITLE_MAX = 80
const MEMBERS_MAX = 100
const MEMBERS_ERROR = `Список участников должен содержать от 1 до ${MEMBERS_MAX} записей`

const asRecord = (value: unknown) => (value ?? {}) as Record<string, unknown>

const parseMemberIds = (value: unknown): string[] => {
  const raw = Array.isArray(value) ? value : []
  if (raw.length === 0 || raw.length > MEMBERS_MAX) {
    throw new HttpError(HttpStatus.BAD_REQUEST, MEMBERS_ERROR)
  }
  return raw.map((item) => requireUuid(item, 'memberIds'))
}

export const parseCompanionId = (body: unknown) => requireUuid(asRecord(body).companionId, 'companionId')

export const parseMessageBody = (body: unknown) =>
  requireString(asRecord(body).body, 'body', BODY_MIN, BODY_MAX)

export const parseGroupInput = (body: unknown): IGroupInput => {
  const raw = asRecord(body)
  return {
    title: requireString(raw.title, 'title', TITLE_MIN, TITLE_MAX),
    memberIds: parseMemberIds(raw.memberIds),
  }
}

export const parseMemberList = (body: unknown) => parseMemberIds(asRecord(body).memberIds)

export const parseTitle = (body: unknown) => requireString(asRecord(body).title, 'title', TITLE_MIN, TITLE_MAX)

export const parseMemberId = (body: unknown) => requireUuid(asRecord(body).memberId, 'memberId')
