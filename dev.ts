const PROCESSES = [
  { name: 'server', args: ['--watch', 'server/index.ts'] },
  { name: 'app', args: ['--hot', 'app.tsx'] },
] as const

const children = PROCESSES.map(({ name, args }) => {
  console.log(`[${name}] bun ${args.join(' ')}`)
  return Bun.spawn(['bun', ...args], { stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' })
})

const stopAll = () => {
  children.forEach((child) => child.kill())
  process.exit(0)
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)

await Promise.race(children.map((child) => child.exited))
stopAll()
