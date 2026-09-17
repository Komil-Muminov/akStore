import type { IColleague, IConversation, IMember, IMessage } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { SEARCH_MIN_LENGTH } from './model'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IGroupSubmit } from '@/features/ChatGroupForm'

interface ISendVariables {
  conversationId: string
  body: string
}

const INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_HISTORY]
const GROUP_INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_MEMBERS]

export const useConversationsQuery = () =>
  useGetQuery<IConversation[]>(QueryKeys.CHAT, ApiRoutes.CHAT_SEARCH)

export const useCompanionsQuery = () =>
  useGetQuery<IColleague[]>(QueryKeys.CHAT_COLLEAGUES, ApiRoutes.CHAT_COLLEAGUES)

export const useMessageSearchQuery = (query: string) =>
  useGetQuery<IMessage[]>(
    QueryKeys.CHAT_SEARCH,
    ApiRoutes.CHAT_SEARCH_MESSAGES(query.trim()),
    query.trim().length >= SEARCH_MIN_LENGTH,
  )

export const useMembersQuery = (conversationId: string | null, enabled: boolean) =>
  useGetQuery<IMember[]>(
    QueryKeys.CHAT_MEMBERS,
    ApiRoutes.CHAT_MEMBERS(conversationId ?? ''),
    conversationId !== null && enabled,
  )

export const useChatMutations = () => {
  const open = useMutationQuery<IConversation, { companionId: string }>(ApiRoutes.CHAT_OPEN, {
    invalidate: [QueryKeys.CHAT],
  })
  const send = useMutationQuery<IMessage, ISendVariables>((v) => ApiRoutes.CHAT_SEND(v.conversationId), {
    invalidate: INVALIDATE,
    body: (v) => ({ body: v.body }),
  })
  const read = useMutationQuery<{ ok: true }, string>(ApiRoutes.CHAT_READ, {
    method: 'PATCH',
    invalidate: [QueryKeys.CHAT],
  })
  const createGroup = useMutationQuery<IConversation, IGroupSubmit>(ApiRoutes.CHAT_CREATE_GROUP, {
    invalidate: GROUP_INVALIDATE,
  })
  const leave = useMutationQuery<{ ok: true }, string>(ApiRoutes.CHAT_LEAVE, {
    method: 'PATCH',
    invalidate: GROUP_INVALIDATE,
  })
  return { open, send, read, createGroup, leave }
}

export const useOnlineQuery = () => useGetQuery<string[]>(QueryKeys.CHAT_ONLINE, ApiRoutes.CHAT_ONLINE)
