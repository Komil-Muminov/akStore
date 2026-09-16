import { Router } from 'express'
import { passesRouter } from './passes.routes'

export const apiRouter = Router()

apiRouter.use('/passes', passesRouter)
