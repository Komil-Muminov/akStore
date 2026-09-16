export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  GUARD = 'guard',
  EMPLOYEE = 'employee',
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

export interface IUserInput {
  login: string
  password: string
  role: UserRole
  fullName: string
}

export interface ICredentials {
  login: string
  password: string
}

export interface ILoginResult {
  token: string
  user: IAuthUser
}

export const ROLE_RANK: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.GUARD]: 2,
  [UserRole.EMPLOYEE]: 3,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Главный администратор',
  [UserRole.ADMIN]: 'Системный администратор',
  [UserRole.GUARD]: 'Охрана',
  [UserRole.EMPLOYEE]: 'Сотрудник',
}

export const ROLE_HINTS: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Назначает системного администратора',
  [UserRole.ADMIN]: 'Управляет структурой, сотрудниками и охраной',
  [UserRole.GUARD]: 'Работает с пропусками на посту',
  [UserRole.EMPLOYEE]: 'Видит пропуска к себе',
}

export const LOGIN_MIN_LENGTH = 2
export const PASSWORD_MIN_LENGTH = 3
