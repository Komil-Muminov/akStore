import { env } from '@/shared/config'
import { session } from './session'

const RECONNECT_DELAY_MS = 3000
const TOKEN_PARAM = 'token'

type TListener = (payload: unknown) => void

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

const handleMessage = (event: MessageEvent) => {
  try {
    const payload: unknown = JSON.parse(String(event.data))
    listeners.forEach((listener) => listener(payload))
  } catch {
    scheduleReconnect()
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
}
