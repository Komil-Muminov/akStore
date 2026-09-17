import type { IFoundPass, IOnSite, IPassEntry } from '@/entities/entry'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'

const INVALIDATE = [QueryKeys.ON_SITE, QueryKeys.ENTRIES, QueryKeys.PASSES]
const JOURNAL_LIMIT = 100

export const useOnSiteQuery = () => useGetQuery<IOnSite[]>(QueryKeys.ON_SITE, ApiRoutes.ENTRIES_ON_SITE)

export const useEntriesQuery = () =>
  useGetQuery<IPassEntry[]>(QueryKeys.ENTRIES, ApiRoutes.ENTRIES_SEARCH(JOURNAL_LIMIT))

export const useFoundQuery = (code: string, enabled: boolean) =>
  useGetQuery<IFoundPass>(QueryKeys.PASSES, ApiRoutes.ENTRIES_FIND(code), enabled)

export const useGateMutations = () => {
  const checkIn = useMutationQuery<{ direction: string }, string>(ApiRoutes.ENTRIES_CHECK_IN, {
    invalidate: INVALIDATE,
  })
  const checkOut = useMutationQuery<{ direction: string }, string>(ApiRoutes.ENTRIES_CHECK_OUT, {
    invalidate: INVALIDATE,
  })
  return { checkIn, checkOut }
}
