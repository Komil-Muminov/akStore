import { config } from '../config'
import { authService } from '../services/auth.service'
import { HttpStatus } from '../shared/utils'
import { hub, type ISocketData } from './hub'

const TOKEN_PARAM = 'token'
const UPGRADE_FAILED = 'Не удалось установить соединение'
const UNAUTHORIZED = 'Требуется вход'

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
      message: () => undefined,
    },
  })
  console.log(`realtime: ws://localhost:${config.wsPort}`)
}

export { hub } from './hub'
