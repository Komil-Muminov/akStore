import { Router } from 'express'
import { authRouter } from './auth.routes'
import { chatRouter } from './chat.routes'
import { positionsRouter } from './positions.routes'
import { productsRouter } from './products.routes'
import { fiscalRouter, salesRouter, shiftsRouter } from './sales.routes'
import { unitsRouter } from './units.routes'
import { usersRouter } from './users.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/chat', chatRouter)
apiRouter.use('/products', productsRouter)
apiRouter.use('/shifts', shiftsRouter)
apiRouter.use('/sales', salesRouter)
apiRouter.use('/fiscal', fiscalRouter)
apiRouter.use('/positions', positionsRouter)
apiRouter.use('/units', unitsRouter)
