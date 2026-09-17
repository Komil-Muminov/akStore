const DEFAULT_API_URL = 'http://localhost:3000'
const DEFAULT_WS_URL = 'ws://localhost:3001'

const valueOf = (raw: string | undefined, fallback: string) =>
  raw !== undefined && raw.length > 0 ? raw : fallback

export const env = {
  apiUrl: valueOf(process.env.APP_API_URL, DEFAULT_API_URL),
  wsUrl: valueOf(process.env.APP_WS_URL, DEFAULT_WS_URL),
} as const

export const CLIENT_ENV_KEYS = ['APP_API_URL', 'APP_WS_URL'] as const
