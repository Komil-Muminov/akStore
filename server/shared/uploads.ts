import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const UPLOADS_DIR = path.join(ROOT, 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024
const NAME_RADIX = 36
const RANDOM_LENGTH = 8

fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, done) => done(null, UPLOADS_DIR),
  filename: (_req, file, done) => {
    const suffix = Math.random().toString(NAME_RADIX).slice(2, 2 + RANDOM_LENGTH)
    done(null, `${Date.now().toString(NAME_RADIX)}-${suffix}${path.extname(file.originalname)}`)
  },
})

export const uploader = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } })

export const uploadsPathOf = (fileName: string) => path.join(UPLOADS_DIR, path.basename(fileName))

export const decodeFileName = (raw: string) => Buffer.from(raw, 'latin1').toString('utf8')

export const removeUpload = (fileName: string) => {
  if (!fileName) return
  fs.rmSync(uploadsPathOf(fileName), { force: true })
}
