import { ForbiddenError } from '../../errors/index.js';

export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, postgresGetTransactionById) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.postgresGetTransactionById = postgresGetTransactionById;
  }

  async execute(transactionId, params) {
    const transaction =
      await this.postgresGetTransactionById.execute(transactionId);
    if (params?.userId && transaction.user_id !== params.user_id) {
      throw new ForbiddenError();
    }
    return await this.updateTransactionRepository.execute(
      transactionId,
      params,
    );
  }
}
