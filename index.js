import express from 'express'
import 'dotenv/config.js'
import {
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/getUserById.js'
import { GetUserByIdUseCase } from './src/useCases/getUserById.js'
import { CreateUserUseCase } from './src/useCases/createUser.js'
import { PostgresCompareEmail } from './src/repositories/postgres/compareEmail.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/createUser.js'
import { UpdateUserUseCase } from './src/useCases/updateUser.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/updateUser.js'
import { PostgresDeleteUserRepository } from './src/repositories/postgres/deleteUser.js'
import { DeleteUserUseCase } from './src/useCases/deleteUserUseCase.js'
import { DeleteUserController } from './src/controllers/deleteUserById.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
  const compareEmail = new PostgresCompareEmail()
  const createUserRepository = new PostgresCreateUserRepository()

  const createUser = new CreateUserUseCase(compareEmail, createUserRepository)

  const createUserController = new CreateUserController(createUser)

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
  const postgresCompareEmail = new PostgresCompareEmail()
  const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(
    postgresCompareEmail,
    postgresUpdateUserRepository,
  )
  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.execute(request)
  response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
