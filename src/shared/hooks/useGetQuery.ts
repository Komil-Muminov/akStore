import { useQuery } from '@tanstack/react-query'
import type { QueryKeys } from '@/shared/config'
import { request } from '@/shared/lib'

export const useGetQuery = <T>(key: QueryKeys, url: string, enabled = true) =>
  useQuery<T, Error>({
    queryKey: [key, url],
    queryFn: () => request<T>(url),
    enabled,
  })
