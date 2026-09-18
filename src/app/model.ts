import { lazy, type JSX, type LazyExoticComponent } from 'react'
import { AppRoutes } from '@/shared/config'

export const INITIAL_ROUTE = AppRoutes.SALE

export const PAGES: Record<AppRoutes, LazyExoticComponent<() => JSX.Element>> = {
  [AppRoutes.SALE]: lazy(() => import('@/pages/SalePage')),
  [AppRoutes.PRODUCTS]: lazy(() => import('@/pages/ProductsPage')),
  [AppRoutes.STOCK]: lazy(() => import('@/pages/StockPage')),
  [AppRoutes.SHIFTS]: lazy(() => import('@/pages/ShiftsPage')),
  [AppRoutes.REPORTS]: lazy(() => import('@/pages/ReportsPage')),
  [AppRoutes.DEBTS]: lazy(() => import('@/pages/DebtsPage')),
  [AppRoutes.OUTLETS]: lazy(() => import('@/pages/OutletsPage')),
  [AppRoutes.SUPPLIERS]: lazy(() => import('@/pages/SuppliersPage')),
  [AppRoutes.CHAT]: lazy(() => import('@/pages/ChatPage')),
  [AppRoutes.STRUCTURE]: lazy(() => import('@/pages/StructurePage')),
  [AppRoutes.USERS]: lazy(() => import('@/pages/UsersPage')),
}

export const LoginPage = lazy(() => import('@/pages/LoginPage'))

export const ERROR_TITLE = 'Что-то пошло не так'
export const RETRY_LABEL = 'Повторить'
