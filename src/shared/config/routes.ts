export enum AppRoutes {
  PASSES = 'passes',
  STRUCTURE = 'structure',
  USERS = 'users',
  REPORTS = 'reports',
  CHAT = 'chat',
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
  HOSTS_SEARCH: '/hosts/search',
  CHAT_SEARCH: '/chat/search',
  CHAT_HISTORY: (id: string) => `/chat/history/${id}`,
  CHAT_OPEN: '/chat/open',
  CHAT_SEND: (id: string) => `/chat/send/${id}`,
  CHAT_READ: (id: string) => `/chat/read/${id}`,
  CHAT_CREATE_GROUP: '/chat/create-group',
  CHAT_MEMBERS: (id: string) => `/chat/members/${id}`,
  CHAT_ADD_MEMBERS: (id: string) => `/chat/add-members/${id}`,
  CHAT_LEAVE: (id: string) => `/chat/leave/${id}`,
  CHAT_UNREAD: '/chat/unread-count',
  CHAT_ONLINE: '/chat/online',
  REPORTS_SUMMARY: (query: string) => `/reports/summary?${query}`,
  REPORTS_PASSES: (query: string) => `/reports/passes?${query}`,
  REPORTS_EXPORT: (query: string) => `/reports/export?${query}`,
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
