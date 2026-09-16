import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { launch } from '@gpuix/react/automation'

const DEFAULT_OUT = 'screenshots/gatePass.png'
const WAIT_TIMEOUT_MS = 60_000

const out = process.argv[2] ?? DEFAULT_OUT
mkdirSync(path.dirname(out), { recursive: true })

const app = await launch({
  command: 'bun',
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})
await app.getByTestId('passes__create').waitFor({ timeoutMs: WAIT_TIMEOUT_MS })
await app.clock.pause()
await app.screenshot({ path: out })
await app.close()

console.log(`[screenshot] записан ${out}`)
