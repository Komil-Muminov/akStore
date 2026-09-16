export interface IApiResponse<T> {
  data: T
}

export interface IPagedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IApiError {
  message: string
}

export type THttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface ISessionUser {
  id: string
  login: string
  role: string
  fullName: string
}

export interface ISession {
  token: string
  user: ISessionUser
}
