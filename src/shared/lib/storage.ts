const APP_DIR = '.gatepass'

const isBun = typeof Bun !== 'undefined'

const filePath = async (key: string) => {
  const os = await import('node:os')
  const path = await import('node:path')
  const fs = await import('node:fs')
  const dir = path.join(os.homedir(), APP_DIR)
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, `${key}.json`)
}

export const storage = {
  read: async (key: string) => {
    if (!isBun) return globalThis.localStorage?.getItem(key) ?? null
    const file = Bun.file(await filePath(key))
    return (await file.exists()) ? file.text() : null
  },
  write: async (key: string, value: string) => {
    if (!isBun) {
      globalThis.localStorage?.setItem(key, value)
      return
    }
    await Bun.write(await filePath(key), value)
  },
  remove: async (key: string) => {
    if (!isBun) {
      globalThis.localStorage?.removeItem(key)
      return
    }
    const fs = await import('node:fs')
    fs.rmSync(await filePath(key), { force: true })
  },
}
