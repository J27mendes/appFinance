import express from 'express'
import 'dotenv/config.js'
import {
  makeDeleteUserById,
  makeGetUserById,
  makePostUser,
  makeUpdateUserById,
} from './src/factores/controllers/users.js'
import {
  makeGetTransactionByUserIdController,
  makeCreateTransactionController,
  makeUpdateTransactionController,
} from './src/factores/controllers/transactions.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
  const createUserController = makePostUser()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserById()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserById()

  const { statusCode, body } = await updateUserController.execute(request)
  response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserById()

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

app.get('/api/transactions/:userId', async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionByUserIdController()

  const { statusCode, body } =
    await getTransactionsByUserIdController.execute(request)

  response.status(statusCode).send(body)
})

app.post('/api/transactions', async (request, response) => {
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

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
