export interface IApiResponse<T> {
  data: T
}

export interface IApiError {
  message: string
}

export type THttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
