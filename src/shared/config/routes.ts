export enum AppRoutes {
  PASSES = 'passes',
  STRUCTURE = 'structure',
  USERS = 'users',
}

export const ApiRoutes = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',
  USERS_LIST: '/users/list',
  USERS_SEARCH: (query?: string, page = 1, limit = 10) => {
    const params = new URLSearchParams()
    if (query?.trim()) params.set('q', query.trim())
    params.set('page', String(page))
    params.set('limit', String(limit))
    return `/users/search?${params.toString()}`
  },
  USERS_CREATE: '/users/create',
  USERS_UPDATE: (id: string) => `/users/update/${id}`,
  USERS_RESET_PASSWORD: (id: string) => `/users/reset-password/${id}`,
  USERS_DELETE: (id: string) => `/users/delete/${id}`,
  PASSES_SEARCH: (query?: string, status?: string, page = 1, limit = 10) => {
    const params = new URLSearchParams()
    if (query?.trim()) params.set('q', query.trim())
    if (status && status !== 'all') params.set('status', status)
    params.set('page', String(page))
    params.set('limit', String(limit))
    return `/passes/search?${params.toString()}`
  },
  PASSES_CREATE: '/passes/create',
  PASSES_UPDATE: (id: string) => `/passes/update/${id}`,
  PASSES_DEACTIVATE: (id: string) => `/passes/deactivate/${id}`,
  PASSES_ACTIVATE: (id: string) => `/passes/activate/${id}`,
  PASSES_DELETE: (id: string) => `/passes/delete/${id}`,
  POSITIONS_SEARCH: (query?: string) =>
    query?.trim() ? `/positions/search?q=${encodeURIComponent(query.trim())}` : '/positions/search',
  POSITIONS_CREATE: '/positions/create',
  POSITIONS_UPDATE: (id: string) => `/positions/update/${id}`,
  POSITIONS_DELETE: (id: string) => `/positions/delete/${id}`,
  UNITS_SEARCH: '/units/search',
  UNITS_CREATE: '/units/create',
  UNITS_UPDATE: (id: string) => `/units/update/${id}`,
  UNITS_MOVE: (id: string) => `/units/move/${id}`,
  UNITS_SET_LAYOUT: '/units/set-layout',
  UNITS_SET_POSITIONS: (id: string) => `/units/set-positions/${id}`,
  UNITS_DELETE: (id: string) => `/units/delete/${id}`,
} as const
