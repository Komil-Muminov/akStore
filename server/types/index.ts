export enum PassStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface IPassInput {
  holderName: string
  hostName: string
  organization: string
  purpose: string
  phone: string
  carPlate: string
}

export interface IPass extends IPassInput {
  id: string
  status: PassStatus
  createdAt: string
  updatedAt: string
}

export interface IPassRow {
  id: string
  holder_name: string
  host_name: string
  organization: string
  purpose: string
  phone: string
  car_plate: string
  status: PassStatus
  created_at: Date
  updated_at: Date
}

export { UserRole, ROLE_RANK } from './auth'
export type { IAuthUser, IUser, IUserRow, IUserInput, ITokenPayload } from './auth'
export { UnitType } from './org'
export type { IPosition, IPositionRow, IPositionInput, IUnit, IUnitRow, IUnitInput } from './org'

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./auth').IAuthUser
  }
}
