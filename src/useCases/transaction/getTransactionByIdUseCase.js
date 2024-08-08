import { UserNotFoundError } from '../../errors/userNotFoundError.js'

export class GetTransactionByIdUseCase {
  constructor(postgresGetTransactionByIdRepository, getUserIdRepository) {
    this.postgresGetTransactionByIdRepository =
      postgresGetTransactionByIdRepository
    this.getUserIdRepository = getUserIdRepository
  }

  async execute(params) {
    const user = await this.getUserIdRepository.execute(params.userId)

    if (!user) {
      throw new UserNotFoundError(params.userId)
    }
    const transactions =
      await this.postgresGetTransactionByIdRepository.execute(params.userId)

    return transactions
  }
}
