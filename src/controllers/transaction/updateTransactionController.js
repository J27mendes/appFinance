import { ZodError } from 'zod'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  badRequest,
  ok,
} from '../helpers/index.js'

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }
  async execute(htpRequest) {
    try {
      const idIsValid = checkIfIdIsValid(htpRequest.params.transactionId)

      if (!idIsValid) {
        return invalidIdResponse()
      }
      const params = htpRequest.body

      await updateTransactionSchema.parseAsync(params)

      const transaction = await this.updateTransactionUseCase.execute(
        htpRequest.params.transactionId,
        params,
      )

      return ok(transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }
      console.error(error)
      return serverError()
    }
  }
}
