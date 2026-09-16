import { env } from '@/shared/config'
import type { IApiError, IApiResponse, THttpMethod } from '@/shared/model'
import { session } from './session'

interface IRequestOptions {
  method?: THttpMethod
  body?: unknown
}

const FALLBACK_ERROR = 'Ошибка сети'
const UNAUTHORIZED = 401

export const request = async <T>(url: string, options: IRequestOptions = {}): Promise<T> => {
  const token = session.get()?.token
  const response = await fetch(`${env.apiUrl}${url}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const payload = (await response.json().catch(() => null)) as IApiResponse<T> | IApiError | null
  if (response.status === UNAUTHORIZED && token) session.set(null)
  const failed = !response.ok || payload === null
  const message = (payload as IApiError | null)?.message ?? FALLBACK_ERROR
  if (failed) throw new Error(message)
  return (payload as IApiResponse<T>).data
}
