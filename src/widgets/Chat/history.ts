import { useCallback, useEffect, useState } from 'react'
import type { IMessage } from '@/entities/message'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery } from '@/shared/hooks'

export interface IHistoryPage {
  items: IMessage[]
  hasMore: boolean
}

const merge = (current: IMessage[], incoming: IMessage[]) => {
  const known = new Map(current.map((message) => [message.id, message]))
  for (const message of incoming) known.set(message.id, message)
  return [...known.values()].sort((first, second) => first.createdAt.localeCompare(second.createdAt))
}

export const useHistoryPages = (conversationId: string | null) => {
  const [before, setBefore] = useState<string | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const page = useGetQuery<IHistoryPage>(
    QueryKeys.CHAT_HISTORY,
    ApiRoutes.CHAT_HISTORY(conversationId ?? '', before),
    conversationId !== null,
  )

  useEffect(() => {
    setBefore(null)
    setMessages([])
  }, [conversationId])

  const loaded = page.data
  useEffect(() => {
    if (loaded) setMessages((current) => merge(current, loaded.items))
  }, [loaded])

  const loadOlder = useCallback(() => {
    const oldest = messages[0]
    if (oldest) setBefore(oldest.createdAt)
  }, [messages])

  return {
    messages,
    hasMore: loaded?.hasMore ?? false,
    loading: page.isPending && messages.length === 0,
    loadOlder,
  }
}
