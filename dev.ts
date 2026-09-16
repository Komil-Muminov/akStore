const SERVER_PORT = Number(process.env.PORT ?? 3000)
const READY_TIMEOUT_MS = 30_000
const POLL_INTERVAL_MS = 250

const spawn = (name: string, args: string[]) => {
  console.log(`[${name}] bun ${args.join(' ')}`)
  return Bun.spawn(['bun', ...args], { stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' })
}

const waitForServer = async () => {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    const ready = await fetch(`http://localhost:${SERVER_PORT}/passes/search`)
      .then(() => true)
      .catch(() => false)
    if (ready) return true
    await Bun.sleep(POLL_INTERVAL_MS)
  }
  return false
}

const server = spawn('server', ['--watch', 'server/index.ts'])
const ready = await waitForServer()
if (!ready) console.log('[dev] сервер не ответил вовремя, запускаю окно всё равно')
const app = spawn('app', ['--hot', 'app.tsx'])
const children = [server, app]

const stopAll = () => {
  children.forEach((child) => child.kill())
  process.exit(0)
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)

await Promise.race(children.map((child) => child.exited))
stopAll()

export {}
