import { UserNotFoundError } from '../../errors/userNotFoundError.js'
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
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
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse(httpRequest.params.transactionId)
      }
      console.error('Error in delete user controller:', error)
      return serverError()
    }
  }
}
