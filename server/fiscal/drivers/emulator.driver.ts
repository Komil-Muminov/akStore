import { config } from '../../config'
import { qrOf } from '../document'
import { FiscalDocumentKind, FiscalMode, type IFiscalDocument, type IFiscalDriver } from '../model'

const DEVICE_FALLBACK = 'EMU-0000000001'
const SIGN_LENGTH = 10
const SIGN_BASE = 36
const REFUND_PREFIX = 'R'

let counter = 0
let shiftOpen = false

const deviceOf = () => (config.fiscal.serial.trim().length > 0 ? config.fiscal.serial.trim() : DEVICE_FALLBACK)

const signOf = (document: IFiscalDocument, number: string) => {
  const source = `${deviceOf()}:${number}:${document.total.toFixed(2)}:${document.createdAt}`
  const hash = new Bun.CryptoHasher('sha256').update(source).digest('hex')
  return BigInt(`0x${hash.slice(0, 16)}`).toString(SIGN_BASE).toUpperCase().padStart(SIGN_LENGTH, '0')
}

const numberOf = (document: IFiscalDocument) => {
  counter += 1
  const prefix = document.kind === FiscalDocumentKind.REFUND ? REFUND_PREFIX : ''
  return `${prefix}${String(counter).padStart(SIGN_LENGTH, '0')}`
}

export const emulatorDriver: IFiscalDriver = {
  mode: FiscalMode.EMULATOR,
  enabled: true,
  connect: async () => {
    shiftOpen = false
  },
  disconnect: async () => {
    shiftOpen = false
  },
  probe: async () => true,
  device: deviceOf,
  register: async (document: IFiscalDocument) => {
    const number = numberOf(document)
    const sign = signOf(document, number)
    return { number, sign, device: deviceOf(), qr: qrOf(document, number, sign, deviceOf()) }
  },
  openShift: async () => {
    shiftOpen = true
  },
  closeShift: async () => {
    if (!shiftOpen) return null
    shiftOpen = false
    return {
      number: String(counter).padStart(SIGN_LENGTH, '0'),
      device: deviceOf(),
      total: 0,
      cashTotal: 0,
      cardTotal: 0,
      refundTotal: 0,
      vatTotal: 0,
      createdAt: new Date().toISOString(),
    }
  },
}
