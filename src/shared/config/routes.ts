export enum AppRoutes {
  SALE = 'sale',
  PRODUCTS = 'products',
  STOCK = 'stock',
  SHIFTS = 'shifts',
  REPORTS = 'reports',
  CHAT = 'chat',
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
  PRODUCTS_SEARCH: (query?: string, category?: string, page = 1, limit = 20) => {
    const params = new URLSearchParams()
    if (query?.trim()) params.set('q', query.trim())
    if (category) params.set('category', category)
    params.set('page', String(page))
    params.set('limit', String(limit))
    return `/products/search?${params.toString()}`
  },
  PRODUCTS_BARCODE: (code: string) => `/products/barcode/${encodeURIComponent(code)}`,
  PRODUCTS_CATEGORIES: '/products/categories',
  PRODUCTS_HISTORY: (productId?: string) =>
    productId ? `/products/history?product=${productId}` : '/products/history',
  PRODUCTS_CREATE: '/products/create',
  PRODUCTS_UPDATE: (id: string) => `/products/update/${id}`,
  PRODUCTS_DELETE: (id: string) => `/products/delete/${id}`,
  CATEGORY_CREATE: '/products/category-create',
  CATEGORY_UPDATE: (id: string) => `/products/category-update/${id}`,
  CATEGORY_DELETE: (id: string) => `/products/category-delete/${id}`,
  STOCK_INCOME: '/products/income',
  STOCK_WRITE_OFF: '/products/write-off',
  STOCK_INVENTORY: '/products/inventory',
  SHIFT_CURRENT: '/shifts/current',
  SHIFT_LIST: '/shifts/list',
  SHIFT_OPEN: '/shifts/open',
  SHIFT_CLOSE: '/shifts/close',
  SALES_SEARCH: (shiftId?: string, limit = 50) =>
    shiftId ? `/sales/search?shift=${shiftId}&limit=${String(limit)}` : `/sales/search?limit=${String(limit)}`,
  SALES_CREATE: '/sales/create',
  SALES_REFUND: (id: string) => `/sales/refund/${id}`,
  FISCAL_STATUS: '/fiscal/status',
  CHAT_SEARCH: '/chat/search',
  CHAT_HISTORY: (id: string, before?: string | null) =>
    before ? `/chat/history/${id}?before=${encodeURIComponent(before)}` : `/chat/history/${id}`,
  CHAT_OPEN: '/chat/open',
  CHAT_SEND: (id: string) => `/chat/send/${id}`,
  CHAT_READ: (id: string) => `/chat/read/${id}`,
  CHAT_CREATE_GROUP: '/chat/create-group',
  CHAT_MEMBERS: (id: string) => `/chat/members/${id}`,
  CHAT_ADD_MEMBERS: (id: string) => `/chat/add-members/${id}`,
  CHAT_LEAVE: (id: string) => `/chat/leave/${id}`,
  CHAT_UNREAD: '/chat/unread-count',
  CHAT_COLLEAGUES: '/chat/colleagues',
  CHAT_ONLINE: '/chat/online',
  CHAT_UPLOAD: (id: string) => `/chat/upload/${id}`,
  CHAT_FILE: (id: string) => `/chat/file/${id}`,
  CHAT_RENAME: (id: string) => `/chat/rename/${id}`,
  CHAT_REMOVE_MEMBER: (id: string) => `/chat/remove-member/${id}`,
  CHAT_EDIT_MESSAGE: (id: string) => `/chat/edit-message/${id}`,
  CHAT_DELETE_MESSAGE: (id: string) => `/chat/delete-message/${id}`,
  CHAT_SEARCH_MESSAGES: (query: string) => `/chat/search-messages?q=${encodeURIComponent(query)}`,
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
