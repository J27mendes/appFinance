import { TransactionNotFoundError } from '../../errors/transactionNotFoundError.js'

import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  transactionNotFoundResponse,
} from '../helpers/index.js'

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const idIsValid = httpRequest.params.transactionId

      const isIdValid = checkIfIdIsValid(idIsValid)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const deletedTransaction =
        await this.deleteTransactionUseCase.execute(idIsValid)

      if (deletedTransaction === null) {
        return badRequest({
          message: 'Transaction not found',
        })
      }

      return ok({
        message: 'Transaction deleted successfully',
        transaction: deletedTransaction,
      })
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse(httpRequest.params.transactionId)
      }

      return serverError()
    }
  }
}
