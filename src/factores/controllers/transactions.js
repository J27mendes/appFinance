import { CreateTransactionController } from '../../controllers/transaction/controllerTransaction.js'
import { GetTransactionByUserIdController } from '../../controllers/transaction/getTransactionUserByIdController.js'
import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByIdRepository,
  PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import {
  CreateTransactionUseCase,
  GetTransactionByIdUseCase,
} from '../../useCases/index.js'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()
  const getUserByIdRepository = new PostgresGetTransactionsByIdRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )

  return createTransactionController
}

export const makeGetTransactionByUserIdController = () => {
  const getTransactionByUserIdRepository =
    new PostgresGetTransactionsByIdRepository()

  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getTransactionByUserIdUseCase = new GetTransactionByIdUseCase(
    getTransactionByUserIdRepository,
    getUserByIdRepository,
  )

  const getTransactionByUserIdController = new GetTransactionByUserIdController(
    getTransactionByUserIdUseCase,
  )

  return getTransactionByUserIdController
}
