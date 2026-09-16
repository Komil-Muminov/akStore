export enum PassStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface IPass {
  id: string
  holderName: string
  status: PassStatus
  createdAt: string
}

export interface IPassRow {
  id: string
  holder_name: string
  status: PassStatus
  created_at: Date
}

export interface ICreatePassDto {
  holderName: string
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
