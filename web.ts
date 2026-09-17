import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CLIENT_ENV_KEYS } from './src/shared/config/env'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'web-dist')
const DEFAULT_PORT = 4173

const ISOLATION = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

const CONTENT_TYPES: Record<string, string> = {
  '.wasm': 'application/wasm',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
}

const contentType = (pathname: string) => CONTENT_TYPES[path.extname(pathname)] ?? 'text/html'

const define = Object.fromEntries(
  CLIENT_ENV_KEYS.map((key) => [`process.env.${key}`, JSON.stringify(process.env[key] ?? '')]),
)

const bundle = await Bun.build({
  entrypoints: [path.join(ROOT, 'app.tsx')],
  outdir: OUT,
  target: 'browser',
  format: 'esm',
  naming: 'app.js',
  define,
  throw: false,
})

if (!bundle.success) {
  bundle.logs.forEach((message) => console.error(message))
  process.exit(1)
}

const server = Bun.serve({
  port: Number(process.env.WEB_PORT ?? DEFAULT_PORT),
  fetch: (request) => {
    const { pathname } = new URL(request.url)
    const file = pathname === '/' ? path.join(ROOT, 'index.html') : path.join(OUT, pathname.slice(1))
    const missing = !file.startsWith(ROOT) || !existsSync(file)
    return pathname === '/favicon.ico'
      ? new Response(null, { status: 204, headers: ISOLATION })
      : missing
        ? new Response('Not found', { status: 404 })
        : new Response(Bun.file(file), {
            headers: { ...ISOLATION, 'Content-Type': contentType(pathname) },
          })
  },
})

console.log(`web: http://localhost:${server.port}`)
