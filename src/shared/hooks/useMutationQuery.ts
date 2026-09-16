import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKeys } from '@/shared/config'
import { request } from '@/shared/lib'
import type { THttpMethod } from '@/shared/model'

interface IMutationOptions {
  method?: THttpMethod
  invalidate: QueryKeys[]
}

export const useMutationQuery = <TResult, TBody = void>(
  url: string | ((body: TBody) => string),
  options: IMutationOptions,
) => {
  const queryClient = useQueryClient()
  return useMutation<TResult, Error, TBody>({
    mutationFn: (body) =>
      request<TResult>(typeof url === 'function' ? url(body) : url, {
        method: options.method ?? 'POST',
        body: typeof url === 'function' ? undefined : body,
      }),
    onSuccess: () =>
      Promise.all(options.invalidate.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  })
}
