import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { QueryKeys } from '@/shared/config'
import { useSocketEvent } from '@/shared/hooks'
import { ChatEventType, type IChatEvent, type IPresencePayload, type ITypingPayload } from '@/shared/model'

const TYPING_TIMEOUT_MS = 4000
const REFRESH_ON = [
  ChatEventType.MESSAGE,
  ChatEventType.MESSAGE_UPDATED,
  ChatEventType.MESSAGE_REMOVED,
  ChatEventType.READ,
]

export const useChatRealtime = (activeId: string | null) => {
  const queryClient = useQueryClient()
  const [online, setOnline] = useState<string[]>([])
  const [typing, setTyping] = useState<ITypingPayload | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    [],
  )

  const handleEvent = useCallback(
    (event: IChatEvent) => {
      if (REFRESH_ON.includes(event.type)) {
        for (const key of [QueryKeys.CHAT, QueryKeys.CHAT_HISTORY, QueryKeys.CHAT_UNREAD]) {
          void queryClient.invalidateQueries({ queryKey: [key] })
        }
      }
      if (event.type === ChatEventType.PRESENCE) {
        const { userId, online: isOnline } = event.payload as IPresencePayload
        setOnline((current) =>
          isOnline ? [...new Set([...current, userId])] : current.filter((id) => id !== userId),
        )
      }
      if (event.type === ChatEventType.TYPING) {
        const payload = event.payload as ITypingPayload
        setTyping(payload)
        if (timer.current !== null) clearTimeout(timer.current)
        timer.current = setTimeout(() => setTyping(null), TYPING_TIMEOUT_MS)
      }
    },
    [queryClient],
  )
  useSocketEvent(handleEvent)

  const typingName = typing !== null && typing.conversationId === activeId ? typing.userName : ''

  return { online, setOnline, typingName }
}
