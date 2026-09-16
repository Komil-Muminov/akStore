import cors from 'cors'
import express from 'express'
import { config } from './config'
import { initDb } from './db'
import { authMiddleware, errorMiddleware } from './middleware'
import { apiRouter } from './routes'
import { HttpError, HttpStatus } from './shared/utils'

const app = express()

app.use(cors())
app.use(express.json())
app.use(authMiddleware)
app.use(apiRouter)
app.use((req, _res, next) => {
  next(new HttpError(HttpStatus.NOT_FOUND, `Маршрут ${req.method} ${req.originalUrl} не найден`))
})
app.use(errorMiddleware)

await initDb()

app.listen(config.port, () => {
  console.log(`server: http://localhost:${config.port}`)
})

