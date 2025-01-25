import { Router } from 'express'
import {
  makeGetTransactionByUserIdController,
  makeCreateTransactionController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from '../factores/controllers/index.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionByUserIdController()

  const { statusCode, body } =
    await getTransactionsByUserIdController.execute(request)

  response.status(statusCode).send(body)
})

transactionsRouter.post('/', async (request, response) => {
  const createTransactionController = makeCreateTransactionController()
  const { statusCode, body } =
    await createTransactionController.execute(request)
  response.status(statusCode).send(body)
})

transactionsRouter.patch('/:transactionId', async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController()

  const { statusCode, body } =
    await updateTransactionController.execute(request)

  response.status(statusCode).send(body)
})

transactionsRouter.delete('/:transactionId', async (request, response) => {
  const deleteTransactionById = makeDeleteTransactionController()

  const { statusCode, body } = await deleteTransactionById.execute(request)

  response.status(statusCode).send(body)
})
