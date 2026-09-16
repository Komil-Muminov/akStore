import type { ServerWebSocket } from 'bun'
import { ChatEventType, type IChatEvent, type ISocketData } from './model'

type TSocket = ServerWebSocket<ISocketData>

const connections = new Map<string, Set<TSocket>>()

const send = (userIds: string[], event: IChatEvent) => {
  const body = JSON.stringify(event)
  for (const userId of userIds) {
    const sockets = connections.get(userId)
    if (!sockets) continue
    for (const socket of sockets) socket.send(body)
  }
}

const announce = (userId: string, online: boolean) => {
  const audience = [...connections.keys()].filter((id) => id !== userId)
  send(audience, { type: ChatEventType.PRESENCE, payload: { userId, online } })
}

export const hub = {
  add: (userId: string, socket: TSocket) => {
    const existing = connections.get(userId) ?? new Set<TSocket>()
    const wasOffline = existing.size === 0
    existing.add(socket)
    connections.set(userId, existing)
    if (wasOffline) announce(userId, true)
  },
  remove: (userId: string, socket: TSocket) => {
    const existing = connections.get(userId)
    if (!existing) return
    existing.delete(socket)
    if (existing.size > 0) return
    connections.delete(userId)
    announce(userId, false)
  },
  publish: (userIds: string[], type: ChatEventType, payload: unknown) => send(userIds, { type, payload }),
  online: () => [...connections.keys()],
  isOnline: (userId: string) => connections.has(userId),
}
