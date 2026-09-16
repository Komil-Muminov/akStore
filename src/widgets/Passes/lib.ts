import { PassFilter, matchesFilter, matchesQuery, type IPass } from '@/entities/pass'

export const countByFilter = (passes: IPass[]): Record<PassFilter, number> => ({
  [PassFilter.ALL]: passes.length,
  [PassFilter.ACTIVE]: passes.filter((pass) => matchesFilter(pass, PassFilter.ACTIVE)).length,
  [PassFilter.REVOKED]: passes.filter((pass) => matchesFilter(pass, PassFilter.REVOKED)).length,
})

export const selectVisible = (passes: IPass[], filter: PassFilter, query: string): IPass[] =>
  passes.filter((pass) => matchesFilter(pass, filter) && matchesQuery(pass, query))
