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
  unread: number
  user: IAuthUser
  onNavigate: (route: AppRoutes) => void
  onChangePassword: () => void
  onLogout: () => void
}

export const APP_NAME = 'Касса'
export const APP_TAGLINE = 'Торговля и склад'
export const NAV_SECTION = 'Разделы'
export const CHANGE_PASSWORD_TOOLTIP = 'Сменить пароль'
export const LOGOUT_TOOLTIP = 'Выйти'

export const NAV_ITEMS: INavItem[] = [
  { id: AppRoutes.SALE, label: 'Касса', hint: 'Продажа и смена', icon: 'listChecks', minRole: UserRole.EMPLOYEE },
  { id: AppRoutes.PRODUCTS, label: 'Товары', hint: 'Справочник и цены', icon: 'briefcase', minRole: UserRole.ADMIN },
  { id: AppRoutes.STOCK, label: 'Склад', hint: 'Приход и движения', icon: 'download', minRole: UserRole.ADMIN },
  { id: AppRoutes.SHIFTS, label: 'Смены', hint: 'Отчёты по сменам', icon: 'calendar', minRole: UserRole.ADMIN },
  { id: AppRoutes.REPORTS, label: 'Отчёты', hint: 'Выручка, прибыль, товары', icon: 'chart', minRole: UserRole.ADMIN },
  { id: AppRoutes.DEBTS, label: 'Долги', hint: 'Покупатели под запись', icon: 'users', minRole: UserRole.EMPLOYEE },
  { id: AppRoutes.OUTLETS, label: 'Точки', hint: 'Магазины и перемещения', icon: 'building', minRole: UserRole.ADMIN },
  { id: AppRoutes.SUPPLIERS, label: 'Поставщики', hint: 'Накладные и долги', icon: 'briefcase', minRole: UserRole.ADMIN },
  { id: AppRoutes.CHAT, label: 'Сообщения', hint: 'Переписка с коллегами', icon: 'message', minRole: UserRole.EMPLOYEE },
  { id: AppRoutes.STRUCTURE, label: 'Структура', hint: 'Точки и должности', icon: 'building', minRole: UserRole.ADMIN },
  { id: AppRoutes.USERS, label: 'Сотрудники', hint: 'Учётные записи и роли', icon: 'userCog', minRole: UserRole.ADMIN },
]
