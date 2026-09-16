import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { IHost } from '@/entities/host'
import type { IConversation, IMember, IMessage } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IGroupSubmit } from '@/features/ChatGroupForm'
import { socketClient } from '@/shared/lib'

interface ISendVariables {
  conversationId: string
  body: string
}

const INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_HISTORY]
const GROUP_INVALIDATE = [QueryKeys.CHAT, QueryKeys.CHAT_MEMBERS]

export const useConversationsQuery = () =>
  useGetQuery<IConversation[]>(QueryKeys.CHAT, ApiRoutes.CHAT_SEARCH)

export const useCompanionsQuery = () => useGetQuery<IHost[]>(QueryKeys.HOSTS, ApiRoutes.HOSTS_SEARCH)

export const useHistoryQuery = (conversationId: string | null) =>
  useGetQuery<IMessage[]>(
    QueryKeys.CHAT_HISTORY,
    ApiRoutes.CHAT_HISTORY(conversationId ?? ''),
    conversationId !== null,
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

export const useChatSocket = () => {
  const queryClient = useQueryClient()

  useEffect(
    () =>
      socketClient.subscribe(() => {
        for (const key of INVALIDATE) {
          void queryClient.invalidateQueries({ queryKey: [key] })
        }
      }),
    [queryClient],
  )
}
