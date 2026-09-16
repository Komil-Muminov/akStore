import { env } from '@/shared/config'
import { session } from './session'

const DOWNLOADS_DIR = 'Downloads'
const FALLBACK_ERROR = 'Не удалось скачать файл'

const downloadsPath = async (fileName: string) => {
  const os = await import('node:os')
  const path = await import('node:path')
  const fs = await import('node:fs')
  const dir = path.join(os.homedir(), DOWNLOADS_DIR)
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, fileName)
}

export const downloadFile = async (url: string, fileName: string) => {
  const token = session.get()?.token
  const response = await fetch(`${env.apiUrl}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? FALLBACK_ERROR)
  }
  const bytes = await response.arrayBuffer()
  const target = await downloadsPath(fileName)
  await Bun.write(target, bytes)
  return target
}

export const revealFile = async (filePath: string) => {
  if (process.platform === 'win32') {
    Bun.spawn(['explorer', `/select,${filePath}`])
    return
  }
  const path = await import('node:path')
  Bun.spawn([process.platform === 'darwin' ? 'open' : 'xdg-open', path.dirname(filePath)])
}
