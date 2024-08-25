import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  badRequest,
  checkIfAmountIsValid,
  checkIfTypeIsValid,
  invalidTypeResponse,
  invalidAmountResponse,
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

      const allowedFields = ['name', 'date', 'amount', 'type']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: 'Some provided field is not allowed.',
        })
      }
      if (params.amount) {
        const amountIsValid = checkIfAmountIsValid(params.amount)
        if (!amountIsValid) {
          return invalidAmountResponse()
        }
      }
      if (params.type) {
        const typeIsValid = checkIfTypeIsValid(params.type)
        if (!typeIsValid) {
          return invalidTypeResponse()
        }
      }
      const transaction = await this.updateTransactionUseCase.execute(
        htpRequest.params.transactionId,
        params,
      )

      return ok(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
