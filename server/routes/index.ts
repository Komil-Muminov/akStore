import { Router } from 'express'
import { authRouter } from './auth.routes'
import { chatRouter } from './chat.routes'
import { hostsRouter } from './hosts.routes'
import { passesRouter } from './passes.routes'
import { positionsRouter } from './positions.routes'
import { reportsRouter } from './reports.routes'
import { unitsRouter } from './units.routes'
import { usersRouter } from './users.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/chat', chatRouter)
apiRouter.use('/hosts', hostsRouter)
apiRouter.use('/passes', passesRouter)
apiRouter.use('/positions', positionsRouter)
apiRouter.use('/reports', reportsRouter)
apiRouter.use('/units', unitsRouter)
