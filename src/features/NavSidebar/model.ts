import { UserRole, type IAuthUser } from '@/entities/user'
import { AppRoutes } from '@/shared/config'
import type { TIconName } from '@/shared/ui'

export interface INavItem {
  id: AppRoutes
  label: string
  hint: string
  icon: TIconName
  minRole: UserRole
}

export interface IProps {
  active: AppRoutes
  items: INavItem[]
  user: IAuthUser
  onNavigate: (route: AppRoutes) => void
  onChangePassword: () => void
  onLogout: () => void
}

export const APP_NAME = 'gatePass'
export const APP_TAGLINE = 'Пропускная система'
export const NAV_SECTION = 'Разделы'
export const CHANGE_PASSWORD_TOOLTIP = 'Сменить пароль'
export const LOGOUT_TOOLTIP = 'Выйти'

export const NAV_ITEMS: INavItem[] = [
  { id: AppRoutes.PASSES, label: 'Пропуска', hint: 'Выдача и учёт', icon: 'shieldCheck', minRole: UserRole.EMPLOYEE },
  { id: AppRoutes.CHAT, label: 'Сообщения', hint: 'Переписка с коллегами', icon: 'message', minRole: UserRole.EMPLOYEE },
  { id: AppRoutes.STRUCTURE, label: 'Структура', hint: 'Подразделения и должности', icon: 'building', minRole: UserRole.ADMIN },
  { id: AppRoutes.USERS, label: 'Пользователи', hint: 'Учётные записи и роли', icon: 'userCog', minRole: UserRole.ADMIN },
  { id: AppRoutes.REPORTS, label: 'Отчёты', hint: 'Статистика и экспорт в Excel', icon: 'chart', minRole: UserRole.ADMIN },
]
