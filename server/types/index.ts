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

export enum UserRole {
  ADMIN = 'admin',
  GUARD = 'guard',
}

export interface IAuthUser {
  role: UserRole
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IAuthUser
  }
}
