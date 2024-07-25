import {
  PostgresGetUserByIdRepository,
  PostgresCreateUserRepository,
  PostgresUpdateUserRepository,
  PostgresDeleteUserRepository,
  PostgresCompareEmail,
} from '../../repositories/postgres/index.js'
import {
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../useCases/index.js'
import {
  GetUserByIdController,
  CreateUserController,
  UpdateUserController,
  DeleteUserController,
} from '../../controllers/index.js'

export const makeGetUserById = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)
  return getUserByIdController
}

export const makePostUser = () => {
  const compareEmail = new PostgresCompareEmail()
  const createUserRepository = new PostgresCreateUserRepository()
  const createUser = new CreateUserUseCase(compareEmail, createUserRepository)
  const createUserController = new CreateUserController(createUser)
  return createUserController
}

export const makeUpdateUserById = () => {
  const postgresCompareEmail = new PostgresCompareEmail()
  const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(
    postgresCompareEmail,
    postgresUpdateUserRepository,
  )
  const updateUserController = new UpdateUserController(updateUserUseCase)
  return updateUserController
}

export const makeDeleteUserById = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)
  return deleteUserController
}
