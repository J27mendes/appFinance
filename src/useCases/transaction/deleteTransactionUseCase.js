import { TransactionNotFoundError } from '../../errors/transactionNotFoundError.js';

export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }

  async execute(transactionId) {
    const deletedTransaction =
      await this.deleteTransactionRepository.execute(transactionId);
    if (!deletedTransaction) {
      throw new TransactionNotFoundError(transactionId);
    }
    return deletedTransaction;
  }
}
