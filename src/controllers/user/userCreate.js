import { validate } from 'uuid'
import { EmailExistsError } from '../../errors/user.js'
import {
  badRequest,
  created,
  serverError,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
} from '../helpers/index.js'
import { requiredFieldsIsMissingResponse } from '../helpers/validation.js'
export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      const { ok: requiredFieldsWereProvided, missingField } = validate(
        params,
        requiredFields,
      )

      if (!requiredFieldsWereProvided) {
        return requiredFieldsIsMissingResponse(missingField)
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password)

      if (!passwordIsValid) {
        return invalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsValid(params.email)

      if (!emailIsValid) {
        return emailIsAlreadyInUseResponse()
      }

      const createdUser = await this.createUserUseCase.execute(params)
      return created({ createdUser })
    } catch (error) {
      if (error instanceof EmailExistsError) {
        return badRequest({ message: error.message })
      }
      return serverError(error)
    }
  }
}
