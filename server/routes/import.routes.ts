import { Router, type NextFunction, type Request, type Response } from 'express'
import { rbacMiddleware } from '../middleware'
import { importService } from '../services'
import { TEMPLATE_EXAMPLE, TEMPLATE_HEADERS } from '../services/import.columns'
import { uploader } from '../shared/uploads'
import { HttpError, HttpStatus, requireString } from '../shared/utils'
import { UserRole, type IAuthUser } from '../types'
import { respond } from './respond'

const FILE_FIELD = 'file'
const NAME_MIN = 3
const NAME_MAX = 200
const CSV_TYPE = 'text/csv; charset=utf-8'
const TEMPLATE_FILE = 'shablon-tovarov.csv'
const SEPARATOR = ';'
const LINE_BREAK = '\r\n'
const BOM = '﻿'
const NO_FILE = 'Файл не получен'

const manager = rbacMiddleware(UserRole.ADMIN)

const fileNameOf = (req: Request) => {
  const stored = req.file
  if (!stored) throw new HttpError(HttpStatus.BAD_REQUEST, NO_FILE)
  return stored.filename
}

const template = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const content = `${BOM}${[TEMPLATE_HEADERS.join(SEPARATOR), TEMPLATE_EXAMPLE.join(SEPARATOR)].join(LINE_BREAK)}`
    res.setHeader('Content-Type', CSV_TYPE)
    res.setHeader('Content-Disposition', `attachment; filename="${TEMPLATE_FILE}"`)
    res.send(content)
  } catch (error) {
    next(error)
  }
}

export const importRouter = Router()

importRouter.get('/template', manager, template)
importRouter.post('/preview', manager, uploader.single(FILE_FIELD), respond((req) => importService.preview(fileNameOf(req))))
importRouter.post('/apply', manager, respond((req) =>
  importService.apply(
    (req.user as IAuthUser).id,
    requireString((req.body as Record<string, unknown>).fileName, 'fileName', NAME_MIN, NAME_MAX),
  ),
))
