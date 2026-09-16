const DEFAULT_API_URL = 'http://localhost:3000'
const DEFAULT_WS_URL = 'ws://localhost:3001'

export const env = {
  apiUrl: process.env.APP_API_URL ?? DEFAULT_API_URL,
  wsUrl: process.env.APP_WS_URL ?? DEFAULT_WS_URL,
} as const
