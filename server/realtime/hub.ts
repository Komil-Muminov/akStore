import type { ServerWebSocket } from 'bun'

export interface ISocketData {
  userId: string
}

type TSocket = ServerWebSocket<ISocketData>

const connections = new Map<string, Set<TSocket>>()

export const hub = {
  add: (userId: string, socket: TSocket) => {
    const existing = connections.get(userId) ?? new Set<TSocket>()
    existing.add(socket)
    connections.set(userId, existing)
  },
  remove: (userId: string, socket: TSocket) => {
    const existing = connections.get(userId)
    if (!existing) return
    existing.delete(socket)
    if (existing.size === 0) connections.delete(userId)
  },
  publish: (userIds: string[], payload: unknown) => {
    const body = JSON.stringify(payload)
    for (const userId of userIds) {
      const sockets = connections.get(userId)
      if (!sockets) continue
      for (const socket of sockets) socket.send(body)
    }
  },
}
