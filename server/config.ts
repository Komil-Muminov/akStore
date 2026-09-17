import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(ROOT, '.env') })

const DEFAULT_PORT = 3000
const DEFAULT_WS_PORT = 3001
const DEFAULT_DB_PORT = 5432
const DEFAULT_SUPERADMIN_LOGIN = 'km'
const DEFAULT_SUPERADMIN_PASSWORD = '123'
const DEFAULT_TOKEN_TTL = '30d'
const DEFAULT_FISCAL_MODE = 'disabled'

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Переменная окружения ${name} не задана`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  wsPort: Number(process.env.WS_PORT ?? DEFAULT_WS_PORT),
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: required('JWT_SECRET'),
  tokenTtl: process.env.TOKEN_TTL ?? DEFAULT_TOKEN_TTL,
  fiscalMode: process.env.FISCAL_MODE ?? DEFAULT_FISCAL_MODE,
  superadmin: {
    login: process.env.SUPERADMIN_LOGIN ?? DEFAULT_SUPERADMIN_LOGIN,
    password: process.env.SUPERADMIN_PASSWORD ?? DEFAULT_SUPERADMIN_PASSWORD,
  },
  db: {
    host: required('DB_HOST'),
    port: Number(process.env.DB_PORT ?? DEFAULT_DB_PORT),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },
} as const
