export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  GUARD = 'guard',
  EMPLOYEE = 'employee',
}

export const ROLE_RANK: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.GUARD]: 2,
  [UserRole.EMPLOYEE]: 3,
}

export interface IAuthUser {
  id: string
  login: string
  role: UserRole
  fullName: string
}

export interface IUser extends IAuthUser {
  isActive: boolean
  createdAt: string
}

export interface IUserRow {
  id: string
  login: string
  password_hash: string
  role: UserRole
  full_name: string
  is_active: boolean
  created_at: Date
}

export interface IUserInput {
  login: string
  password: string
  role: UserRole
  fullName: string
}

export interface ITokenPayload {
  sub: string
  role: UserRole
}

export interface IUserSearchParams {
  query?: string
  page?: number
  limit?: number
}
