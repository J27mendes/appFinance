import {
  checkIfIdIsValid,
  created,
  invalidIdResponse,
  serverError,
  requiredFieldsIsMissingResponse,
  validateRequestFields,
  checkIfAmountIsValid,
  checkIfTypeIsValid,
  invalidAmountResponse,
  invalidTypeResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

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

      const parsedAmount = parseFloat(params.amount)

      const type = params.type.trim().toUpperCase()

      const typeIsValid = checkIfTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        amount: parsedAmount,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
