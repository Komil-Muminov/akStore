export enum PassStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface IPassInput {
  holderName: string
  hostUserId: string | null
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
  host_user_id: string | null
  host_name: string
  organization: string
  purpose: string
  phone: string
  car_plate: string
  status: PassStatus
  created_at: Date
  updated_at: Date
}

export interface IPagedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IPassSearchParams {
  query?: string
  status?: string
  page?: number
  limit?: number
}

export { UserRole, ROLE_RANK } from './auth'
export type { IAuthUser, IUser, IUserRow, IUserInput, ITokenPayload, IUserSearchParams } from './auth'
export type { IHost, IHostRow } from './hosts'
export { ConversationKind } from './chat'
export type { IConversation, IConversationRow, IMessage, IMessageRow, IMember, IMemberRow, IGroupInput, IAttachment, IColleague, IColleagueRow } from './chat'
export type { IReportPeriod, IReportDay, IReportHost, IReportSummary } from './reports'
export { UnitType } from './org'
export type { IPosition, IPositionRow, IPositionInput, IUnit, IUnitRow, IUnitInput } from './org'

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./auth').IAuthUser
  }
}
