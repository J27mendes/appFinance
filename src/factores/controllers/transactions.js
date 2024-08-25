import { UpdateTransactionController } from '../../controllers/index.js'
import { CreateTransactionController } from '../../controllers/transaction/controllerTransaction.js'
import { GetTransactionByUserIdController } from '../../controllers/transaction/getTransactionUserByIdController.js'
import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
  CreateTransactionUseCase,
  GetTransactionByIdUseCase,
  UpdateTransactionUseCase,
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

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )

  return updateTransactionController
}
