const SERVER_PORT = Number(process.env.PORT ?? 3000)
const READY_TIMEOUT_MS = 30_000
const POLL_INTERVAL_MS = 250
const DEFAULT_MODE = 'app'

const CLIENTS = {
  app: ['--hot', 'app.tsx'],
  web: ['web.ts'],
} as const

type TClientMode = keyof typeof CLIENTS

const resolveMode = (): TClientMode => {
  const requested = process.argv[2] ?? DEFAULT_MODE
  return requested in CLIENTS ? (requested as TClientMode) : DEFAULT_MODE
}

const spawn = (name: string, args: string[]) => {
  console.log(`[${name}] bun ${args.join(' ')}`)
  return Bun.spawn(['bun', ...args], { stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' })
}

const waitForServer = async () => {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    let ready = false
    try {
      await fetch(`http://localhost:${SERVER_PORT}/passes/search`)
      ready = true
    } catch {
      ready = false
    }
    if (ready) return true
    await Bun.sleep(POLL_INTERVAL_MS)
  }
  return false
}

const mode = resolveMode()
const server = spawn('server', ['--watch', 'server/index.ts'])
const ready = await waitForServer()
if (!ready) console.log('[dev] сервер не ответил вовремя, запускаю клиент всё равно')
const client = spawn(mode, [...CLIENTS[mode]])
const children = [server, client]

const stopAll = () => {
  children.forEach((child) => child.kill())
  process.exit(0)
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)

let running = true
while (running) {
  await Bun.sleep(500)
  for (const child of children) {
    if (child.exitCode !== null) {
      running = false
      break
    }
  }
}
stopAll()

export {}
