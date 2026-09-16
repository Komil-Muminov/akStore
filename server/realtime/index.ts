import { config } from '../config'
import { authService } from '../services/auth.service'
import { HttpStatus } from '../shared/utils'
import { hub } from './hub'
import { ChatEventType, type IIncomingEvent, type ISocketData } from './model'
import { handleTyping } from './typing'

const TOKEN_PARAM = 'token'
const UPGRADE_FAILED = 'Не удалось установить соединение'
const UNAUTHORIZED = 'Требуется вход'

const parseIncoming = (raw: string): IIncomingEvent | null => {
  try {
    const parsed = JSON.parse(raw) as Partial<IIncomingEvent>
    const valid = typeof parsed.conversationId === 'string' && parsed.type === ChatEventType.TYPING
    return valid ? { type: ChatEventType.TYPING, conversationId: parsed.conversationId as string } : null
  } catch {
    return null
  }
}

export const startRealtime = () => {
  Bun.serve<ISocketData>({
    port: config.wsPort,
    fetch: async (request, server) => {
      const token = new URL(request.url).searchParams.get(TOKEN_PARAM) ?? ''
      try {
        const user = await authService.verify(token)
        const upgraded = server.upgrade(request, { data: { userId: user.id } })
        return upgraded ? undefined : new Response(UPGRADE_FAILED, { status: HttpStatus.BAD_REQUEST })
      } catch {
        return new Response(UNAUTHORIZED, { status: HttpStatus.UNAUTHORIZED })
      }
    },
    websocket: {
      open: (socket) => hub.add(socket.data.userId, socket),
      close: (socket) => hub.remove(socket.data.userId, socket),
      message: async (socket, raw) => {
        const event = parseIncoming(String(raw))
        if (event) await handleTyping(socket.data.userId, event.conversationId)
      },
    },
  })
  console.log(`realtime: ws://localhost:${config.wsPort}`)
}

export { hub } from './hub'
export { ChatEventType } from './model'
