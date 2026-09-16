import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(ROOT, '.env') })

const DEFAULT_PORT = 3000
const DEFAULT_DB_PORT = 5432

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Переменная окружения ${name} не задана`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  apiToken: required('API_TOKEN'),
  isProduction: process.env.NODE_ENV === 'production',
  db: {
    host: required('DB_HOST'),
    port: Number(process.env.DB_PORT ?? DEFAULT_DB_PORT),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },
} as const
