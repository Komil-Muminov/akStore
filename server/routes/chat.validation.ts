import { requireString, requireUuid } from '../shared/utils'

const BODY_MIN = 1
const BODY_MAX = 4000

export const parseCompanionId = (body: unknown) =>
  requireUuid((body as Record<string, unknown> | null)?.companionId, 'companionId')

export const parseMessageBody = (body: unknown) =>
  requireString((body as Record<string, unknown> | null)?.body, 'body', BODY_MIN, BODY_MAX)
