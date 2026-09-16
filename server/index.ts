import cors from 'cors'
import express from 'express'
import { config } from './config'
import { initDb } from './db'
import { authMiddleware, errorMiddleware } from './middleware'
import { apiRouter } from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(authMiddleware)
app.use(apiRouter)
app.use(errorMiddleware)

await initDb()

app.listen(config.port, () => {
  console.log(`server: http://localhost:${config.port}`)
})
