import { lazy, type JSX, type LazyExoticComponent } from 'react'
import { AppRoutes } from '@/shared/config'

export const INITIAL_ROUTE = AppRoutes.PASSES

export const PAGES: Record<AppRoutes, LazyExoticComponent<() => JSX.Element>> = {
  [AppRoutes.PASSES]: lazy(() => import('@/pages/PassesPage')),
}

export const ERROR_TITLE = 'Что-то пошло не так'
export const RETRY_LABEL = 'Повторить'
