import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(ROOT, '.env') })

const DEFAULT_PORT = 3000

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Переменная окружения ${name} не задана`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  databaseUrl: required('DATABASE_URL'),
  apiToken: required('API_TOKEN'),
  isProduction: process.env.NODE_ENV === 'production',
} as const
