import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { passesService } from '../services'
import { HttpStatus, requireString, requireUuid } from '../shared/utils'
import { UserRole } from '../types'

const HOLDER_MIN = 2
const HOLDER_MAX = 120

export const passesRouter = Router()

passesRouter.get('/search', rbacMiddleware(UserRole.ADMIN, UserRole.GUARD), async (_req, res, next) => {
  try {
    res.json({ data: await passesService.search() })
  } catch (error) {
    next(error)
  }
})

passesRouter.post('/create', rbacMiddleware(UserRole.ADMIN), async (req, res, next) => {
  try {
    const holderName = requireString(req.body?.holderName, 'holderName', HOLDER_MIN, HOLDER_MAX)
    res.status(HttpStatus.CREATED).json({ data: await passesService.create({ holderName }) })
  } catch (error) {
    next(error)
  }
})

passesRouter.patch('/deactivate/:id', rbacMiddleware(UserRole.ADMIN), async (req, res, next) => {
  try {
    const id = requireUuid(req.params.id, 'id')
    res.json({ data: await passesService.deactivate(id) })
  } catch (error) {
    next(error)
  }
})
