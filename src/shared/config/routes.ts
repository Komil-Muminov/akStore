export enum AppRoutes {
  PASSES = 'passes',
}

export const ApiRoutes = {
  PASSES_SEARCH: '/passes/search',
  PASSES_CREATE: '/passes/create',
  PASSES_UPDATE: (id: string) => `/passes/update/${id}`,
  PASSES_DEACTIVATE: (id: string) => `/passes/deactivate/${id}`,
  PASSES_ACTIVATE: (id: string) => `/passes/activate/${id}`,
  PASSES_DELETE: (id: string) => `/passes/delete/${id}`,
} as const
