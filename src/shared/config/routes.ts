export enum AppRoutes {
  PASSES = 'passes',
}

export const ApiRoutes = {
  PASSES_SEARCH: '/passes/search',
  PASSES_CREATE: '/passes/create',
  PASSES_DEACTIVATE: (id: string) => `/passes/deactivate/${id}`,
} as const
