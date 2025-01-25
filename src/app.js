import express from 'express'
import { userRouter } from './routes/users.js'
import { transactionsRouter } from './routes/transactions.js'

export const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.use('/api/transactions', transactionsRouter)
