import { Router } from 'express'
import { authRouter } from './auth.routes'
import { chatRouter } from './chat.routes'
import { positionsRouter } from './positions.routes'
import { productsRouter } from './products.routes'
import { cashRouter, debtsRouter } from './cash.routes'
import { importRouter } from './import.routes'
import { reportsRouter } from './reports.routes'
import { fiscalRouter, parkedRouter, salesRouter, shiftsRouter } from './sales.routes'
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
apiRouter.use('/parked', parkedRouter)
apiRouter.use('/cash', cashRouter)
apiRouter.use('/debts', debtsRouter)
apiRouter.use('/reports', reportsRouter)
apiRouter.use('/import', importRouter)
apiRouter.use('/positions', positionsRouter)
apiRouter.use('/units', unitsRouter)
