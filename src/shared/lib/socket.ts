import { env } from '@/shared/config'
import { ChatEventType, type IChatEvent } from '@/shared/model'
import { session } from './session'

const RECONNECT_DELAY_MS = 3000
const TOKEN_PARAM = 'token'

type TListener = (event: IChatEvent) => void

let socket: WebSocket | null = null
let timer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<TListener>()

const clearTimer = () => {
  if (timer === null) return
  clearTimeout(timer)
  timer = null
}

const scheduleReconnect = () => {
  clearTimer()
  timer = setTimeout(() => connect(), RECONNECT_DELAY_MS)
}

const isChatEvent = (value: unknown): value is IChatEvent =>
  typeof value === 'object' && value !== null && typeof (value as IChatEvent).type === 'string'

const handleMessage = (event: MessageEvent) => {
  try {
    const parsed: unknown = JSON.parse(String(event.data))
    if (isChatEvent(parsed)) listeners.forEach((listener) => listener(parsed))
  } catch {
    clearTimer()
  }
}

const connect = () => {
  const token = session.get()?.token
  if (!token || socket !== null) return
  const next = new WebSocket(`${env.wsUrl}?${TOKEN_PARAM}=${encodeURIComponent(token)}`)
  socket = next
  next.onmessage = handleMessage
  next.onclose = () => {
    socket = null
    if (session.get()?.token) scheduleReconnect()
  }
  next.onerror = () => next.close()
}

const disconnect = () => {
  clearTimer()
  const current = socket
  socket = null
  current?.close()
}

export const socketClient = {
  subscribe: (listener: TListener) => {
    listeners.add(listener)
    connect()
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) disconnect()
    }
  },
  notifyTyping: (conversationId: string) => {
    if (socket?.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({ type: ChatEventType.TYPING, conversationId }))
  },
}
