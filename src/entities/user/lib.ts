import { ROLE_RANK, UserRole } from './model'

export const atLeast = (role: UserRole, minimal: UserRole): boolean => ROLE_RANK[role] <= ROLE_RANK[minimal]

export const canManage = (actor: UserRole, target: UserRole): boolean => ROLE_RANK[actor] < ROLE_RANK[target]

export const assignableRoles = (actor: UserRole): UserRole[] =>
  [UserRole.ADMIN, UserRole.GUARD].filter((role) => canManage(actor, role))

export const toRole = (value: string): UserRole =>
  (Object.values(UserRole) as string[]).includes(value) ? (value as UserRole) : UserRole.EMPLOYEE
