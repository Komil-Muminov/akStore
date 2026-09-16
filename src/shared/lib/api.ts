import { env } from '@/shared/config'
import type { IApiResponse, THttpMethod } from '@/shared/model'
import { session } from './session'

interface IRequestOptions {
  method?: THttpMethod
  body?: unknown
}

const UNAUTHORIZED = 401
const NOT_FOUND = 404
const FORBIDDEN = 403
const SERVER_ERROR = 500
const NO_CONTENT = 204

const getErrorMessage = (status: number, statusText: string, payload: unknown): string => {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (typeof obj.message === 'string' && obj.message.trim().length > 0) return obj.message
    if (typeof obj.error === 'string' && obj.error.trim().length > 0) return obj.error
  }
  if (status === NOT_FOUND) return 'Запрашиваемый ресурс не найден (404)'
  if (status === FORBIDDEN) return 'Доступ запрещён (403)'
  if (status === UNAUTHORIZED) return 'Требуется авторизация'
  if (status >= SERVER_ERROR) return `Внутренняя ошибка сервера (${status})`
  return statusText || `Ошибка запроса (${status})`
}

export const request = async <T>(url: string, options: IRequestOptions = {}) => {
  const token = session.get()?.token
  let response: Response
  try {
    response = await fetch(`${env.apiUrl}${url}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new Error('Не удалось подключиться к серверу')
  }

  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (response.status === UNAUTHORIZED && token) session.set(null)

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, response.statusText, payload))
  }

  if (response.status === NO_CONTENT || payload === null) {
    return undefined as unknown as T
  }

  return (payload as IApiResponse<T>).data
}


export const uploadFile = async <T>(url: string, filePath: string, caption: string) => {
  const token = session.get()?.token
  const path = await import('node:path')
  const form = new FormData()
  form.append('file', Bun.file(filePath), path.basename(filePath))
  form.append('body', caption)

  let response: Response
  try {
    response = await fetch(`${env.apiUrl}${url}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
  } catch {
    throw new Error('Не удалось подключиться к серверу')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new Error(getErrorMessage(response.status, response.statusText, payload))
  return (payload as IApiResponse<T>).data
}
