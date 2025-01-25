import express from 'express'
import 'dotenv/config.js'
import { userRouter } from './src/routes/users.js'
import { transactionsRouter } from './src/routes/transactions.js'

const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.use('/api/transactions', transactionsRouter)

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
