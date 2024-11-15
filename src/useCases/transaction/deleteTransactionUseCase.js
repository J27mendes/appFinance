import { UserNotFoundError } from '../../errors/userNotFoundError.js'

export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository
  }

  async execute(transactionId) {
    try {
      const deletedTransaction =
        await this.deleteTransactionRepository.execute(transactionId)
      return deletedTransaction
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error
      }
      throw new Error('Failed to delete user')
    }
  }
}
