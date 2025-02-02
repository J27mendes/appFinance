import { UserNotFoundError } from '../../errors/userNotFoundError.js';

export class GetTransactionByIdUseCase {
  constructor(postgresGetTransactionByIdRepository, getUserIdRepository) {
    this.postgresGetTransactionByIdRepository =
      postgresGetTransactionByIdRepository;
    this.getUserIdRepository = getUserIdRepository;
  }

  async execute(userId) {
    const user = await this.getUserIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }
    const transactions =
      await this.postgresGetTransactionByIdRepository.execute(userId);

    return transactions;
  }
}
