import { usersDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { ROLE_RANK, UserRole, type IAuthUser, type IUser, type IUserInput } from '../types'

const NOT_FOUND = 'Пользователь не найден'
const FORBIDDEN_ROLE = 'Недостаточно прав для этой роли'
const LOGIN_TAKEN = 'Логин уже занят'
const ADMIN_EXISTS = 'Системный админ уже назначен — отключите или удалите текущего'
const SELF_ACTION = 'Нельзя выполнить это действие над своей учётной записью'

const canManage = (actor: IAuthUser, role: UserRole): boolean => ROLE_RANK[actor.role] < ROLE_RANK[role]

const assertManageable = async (actor: IAuthUser, id: string): Promise<IUser> => {
  const user = await usersDb.find(id)
  if (!user) throw new HttpError(HttpStatus.NOT_FOUND, NOT_FOUND)
  if (user.id === actor.id) throw new HttpError(HttpStatus.BAD_REQUEST, SELF_ACTION)
  if (!canManage(actor, user.role)) throw new HttpError(HttpStatus.FORBIDDEN, FORBIDDEN_ROLE)
  return user
}

export const usersService = {
  search: async (actor: IAuthUser): Promise<IUser[]> =>
    (await usersDb.search()).filter((user) => canManage(actor, user.role)),
  create: async (actor: IAuthUser, input: IUserInput): Promise<IUser> => {
    if (!canManage(actor, input.role)) throw new HttpError(HttpStatus.FORBIDDEN, FORBIDDEN_ROLE)
    if (await usersDb.findRowByLogin(input.login)) throw new HttpError(HttpStatus.BAD_REQUEST, LOGIN_TAKEN)
    if (input.role === UserRole.ADMIN && (await usersDb.countActiveByRole(UserRole.ADMIN)) > 0) {
      throw new HttpError(HttpStatus.BAD_REQUEST, ADMIN_EXISTS)
    }
    const hash = await Bun.password.hash(input.password)
    return usersDb.create(input.login, hash, input.role, input.fullName)
  },
  update: async (actor: IAuthUser, id: string, fullName: string, isActive: boolean): Promise<IUser> => {
    const user = await assertManageable(actor, id)
    if (isActive && !user.isActive && user.role === UserRole.ADMIN && (await usersDb.countActiveByRole(UserRole.ADMIN)) > 0) {
      throw new HttpError(HttpStatus.BAD_REQUEST, ADMIN_EXISTS)
    }
    return (await usersDb.update(id, fullName, isActive)) ?? user
  },
  resetPassword: async (actor: IAuthUser, id: string, password: string): Promise<{ id: string }> => {
    await assertManageable(actor, id)
    await usersDb.setPassword(id, await Bun.password.hash(password))
    return { id }
  },
  remove: async (actor: IAuthUser, id: string): Promise<{ id: string }> => {
    await assertManageable(actor, id)
    await usersDb.remove(id)
    return { id }
  },
}
