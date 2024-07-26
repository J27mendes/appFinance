import {
  checkIfIdIsValid,
  created,
  invalidIdResponse,
  serverError,
} from '../helpers'
import {
  requiredFieldsIsMissingResponse,
  validateRequestFields,
} from '../helpers/validation'
import {
  checkIfAmountIsValid,
  checkIfTypeIsValid,
  invalidAmountResponse,
  invalidTypeResponse,
} from '../helpers/transaction'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['id', 'user_id', 'name', 'date', 'amount', 'type']

      const { ok: requiredFieldsWereProvided, missingField } =
        validateRequestFields(params, requiredFields)

      if (!requiredFieldsWereProvided) {
        return requiredFieldsIsMissingResponse(missingField)
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)
      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      const amountIsValid = checkIfAmountIsValid(params.amount)

      if (!amountIsValid) {
        return invalidAmountResponse()
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = checkIfTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
