import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../config'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const HOUR_MS = 3_600_000
const EXTENSION = '.sql'
const PREFIX = 'gatepass-'
const FAILED = 'Не удалось создать резервную копию'

let timer: ReturnType<typeof setInterval> | null = null

const backupDir = () => {
  const dir = path.isAbsolute(config.backup.dir) ? config.backup.dir : path.join(ROOT, config.backup.dir)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

const cleanup = (dir: string) => {
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.startsWith(PREFIX) && name.endsWith(EXTENSION))
    .sort()
    .reverse()
  for (const stale of files.slice(config.backup.keep)) {
    fs.rmSync(path.join(dir, stale), { force: true })
  }
}

export const backupService = {
  list: async () => {
    const dir = backupDir()
    return fs
      .readdirSync(dir)
      .filter((name) => name.startsWith(PREFIX) && name.endsWith(EXTENSION))
      .sort()
      .reverse()
      .map((name) => {
        const stat = fs.statSync(path.join(dir, name))
        return { name, size: stat.size, createdAt: stat.mtime.toISOString() }
      })
  },

  create: async () => {
    const dir = backupDir()
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const target = path.join(dir, `${PREFIX}${stamp}${EXTENSION}`)
    const child = Bun.spawn(
      ['pg_dump', '-h', config.db.host, '-p', String(config.db.port), '-U', config.db.user, config.db.database],
      { env: { ...process.env, PGPASSWORD: config.db.password }, stdout: Bun.file(target), stderr: 'pipe' },
    )
    const code = await child.exited
    if (code !== 0) {
      fs.rmSync(target, { force: true })
      throw new Error(FAILED)
    }
    cleanup(dir)
    const stat = fs.statSync(target)
    return { name: path.basename(target), size: stat.size, createdAt: stat.mtime.toISOString() }
  },
}

export const startBackups = () => {
  if (timer || config.backup.intervalHours <= 0) return
  timer = setInterval(() => {
    void backupService.create().catch((error: unknown) => console.error(FAILED, error))
  }, config.backup.intervalHours * HOUR_MS)
}
