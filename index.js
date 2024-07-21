import express from 'express'
import 'dotenv/config.js'
import {
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/getUserById.js'
import { GetUserByIdUseCase } from './src/useCases/getUserById.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
  const createUserController = new CreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = new UpdateUserController()
  const { statusCode, body } = await updateUserController.execute(request)
  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
