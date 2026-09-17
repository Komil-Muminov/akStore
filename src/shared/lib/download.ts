import { env } from '@/shared/config'
import { session } from './session'

const DOWNLOADS_DIR = 'Downloads'
const FALLBACK_ERROR = 'Не удалось скачать файл'
const BROWSER_PATH = ''

const isBun = typeof Bun !== 'undefined'

const downloadsPath = async (fileName: string) => {
  const os = await import('node:os')
  const path = await import('node:path')
  const fs = await import('node:fs')
  const dir = path.join(os.homedir(), DOWNLOADS_DIR)
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, fileName)
}

const saveInBrowser = (bytes: ArrayBuffer, fileName: string) => {
  const url = URL.createObjectURL(new Blob([bytes]))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
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
  if (!isBun) {
    saveInBrowser(bytes, fileName)
    return BROWSER_PATH
  }
  const target = await downloadsPath(fileName)
  await Bun.write(target, bytes)
  return target
}

export const openPrintable = async (url: string, fileName: string) => {
  const token = session.get()?.token
  const response = await fetch(`${env.apiUrl}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw new Error(FALLBACK_ERROR)
  const html = await response.text()
  if (!isBun) {
    const page = window.open('', '_blank')
    page?.document.write(html)
    page?.document.close()
    return
  }
  const os = await import('node:os')
  const path = await import('node:path')
  const target = path.join(os.tmpdir(), fileName)
  await Bun.write(target, html)
  Bun.spawn([process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open', target])
}

export const revealFile = async (filePath: string) => {
  if (!isBun || filePath.length === 0) return
  if (process.platform === 'win32') {
    Bun.spawn(['explorer', `/select,${filePath}`])
    return
  }
  const path = await import('node:path')
  Bun.spawn([process.platform === 'darwin' ? 'open' : 'xdg-open', path.dirname(filePath)])
}
