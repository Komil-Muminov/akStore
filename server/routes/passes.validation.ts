import { optionalString, requireString } from '../shared/utils'
import type { IPassInput } from '../types'

const NAME_MIN = 2
const NAME_MAX = 120
const TEXT_MAX = 200
const PHONE_MAX = 32
const PLATE_MAX = 16

export const parsePassInput = (body: unknown): IPassInput => {
  const raw = (body ?? {}) as Record<string, unknown>
  return {
    holderName: requireString(raw.holderName, 'holderName', NAME_MIN, NAME_MAX),
    hostName: requireString(raw.hostName, 'hostName', NAME_MIN, NAME_MAX),
    organization: optionalString(raw.organization, 'organization', TEXT_MAX),
    purpose: optionalString(raw.purpose, 'purpose', TEXT_MAX),
    phone: optionalString(raw.phone, 'phone', PHONE_MAX),
    carPlate: optionalString(raw.carPlate, 'carPlate', PLATE_MAX).toUpperCase(),
  }
}
