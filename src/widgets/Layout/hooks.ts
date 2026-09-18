import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import type { IOutlet } from '@/entities/outlet'
import { useGetQuery, useSocketEvent } from '@/shared/hooks'
import { ChatEventType, type IChatEvent } from '@/shared/model'

const REFRESH_ON = [ChatEventType.MESSAGE, ChatEventType.READ, ChatEventType.MESSAGE_REMOVED]

export const useUnreadTotal = (enabled: boolean) => {
  const queryClient = useQueryClient()
  const query = useGetQuery<{ total: number }>(QueryKeys.CHAT_UNREAD, ApiRoutes.CHAT_UNREAD, enabled)

  const handleEvent = useCallback(
    (event: IChatEvent) => {
      if (!REFRESH_ON.includes(event.type)) return
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT_UNREAD] })
    },
    [queryClient],
  )
  useSocketEvent(handleEvent)

  return query.data?.total ?? 0
}

export const useOutletList = (enabled: boolean) =>
  useGetQuery<IOutlet[]>(QueryKeys.OUTLETS, ApiRoutes.OUTLETS_LIST, enabled)
