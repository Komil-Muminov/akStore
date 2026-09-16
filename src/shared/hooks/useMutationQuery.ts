import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKeys } from '@/shared/config'
import { request } from '@/shared/lib'
import type { THttpMethod } from '@/shared/model'

interface IMutationOptions<TBody> {
  method?: THttpMethod
  invalidate: QueryKeys[]
  body?: (variables: TBody) => unknown
}

export const useMutationQuery = <TResult, TBody = void>(
  url: string | ((variables: TBody) => string),
  options: IMutationOptions<TBody>,
) => {
  const queryClient = useQueryClient()
  return useMutation<TResult, Error, TBody>({
    mutationFn: (variables) =>
      request<TResult>(typeof url === 'function' ? url(variables) : url, {
        method: options.method ?? 'POST',
        body: options.body ? options.body(variables) : typeof url === 'function' ? undefined : variables,
      }),
    onSuccess: () =>
      Promise.all(options.invalidate.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  })
}
