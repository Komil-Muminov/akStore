import net from 'node:net'
import { once } from 'node:events'
import { FiscalTransportKind } from '../model'
import { TRANSPORT_CLOSED, TRANSPORT_TIMEOUT, type IFiscalTransport, type ITransportOptions } from './model'

export const createTcpTransport = (options: ITransportOptions): IFiscalTransport => {
  let socket: net.Socket | null = null

  const address = () => `${options.host}:${options.port}`

  const open = async () => {
    if (socket && !socket.destroyed) return
    const next = net.connect({ host: options.host, port: options.port })
    next.setTimeout(options.timeout)
    next.on('timeout', () => next.destroy(new Error(TRANSPORT_TIMEOUT)))
    await once(next, 'connect')
    socket = next
  }

  const close = async () => {
    if (!socket) return
    socket.destroy()
    socket = null
  }

  const request = async (payload: Uint8Array) => {
    if (!socket || socket.destroyed) throw new Error(TRANSPORT_CLOSED)
    socket.write(payload)
    const [chunk] = (await once(socket, 'data')) as [Buffer]
    return new Uint8Array(chunk)
  }

  return {
    kind: FiscalTransportKind.TCP,
    get isOpen() {
      return socket !== null && !socket.destroyed
    },
    address,
    open,
    close,
    request,
  }
}
