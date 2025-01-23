import express from 'express'
import 'dotenv/config.js'

import {
  makeGetTransactionByUserIdController,
  makeCreateTransactionController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from './src/factores/controllers/transactions.js'
import { userRouter } from './src/routes/users.js'

const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.get('/api/transactions/:userId', async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionByUserIdController()

  const { statusCode, body } =
    await getTransactionsByUserIdController.execute(request)

  response.status(statusCode).send(body)
})

app.post('/api/transactions/:userId', async (request, response) => {
  const createTransactionController = makeCreateTransactionController()
  const { statusCode, body } =
    await createTransactionController.execute(request)
  response.status(statusCode).send(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController()

  const { statusCode, body } =
    await updateTransactionController.execute(request)

  response.status(statusCode).send(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
  const deleteTransactionById = makeDeleteTransactionController()

  const { statusCode, body } = await deleteTransactionById.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
