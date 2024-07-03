import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'
import { EmailExistsError } from '../errors/user.js'
import { UpdateUserUseCase } from '../useCases/updateUser.js'

export class UpdateUserControler {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The provided Id is not valid.',
        })
      }
      const updateUserParams = httpRequest.body

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldsIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldsIsNotAllowed) {
        return badRequest({
          message: 'Some provided is not allowed',
        })
      }

      if (updateUserParams.password) {
        const passwordIsNotValid = updateUserParams.password.length < 6
        if (passwordIsNotValid) {
          return badRequest({
            message: 'Password must be at least 6 characters',
          })
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email)

        if (!emailIsValid) {
          return badRequest({
            message: 'Invalid e-mail. Please provide a valid one.',
          })
        }
      }
      const updateUserUseCase = new UpdateUserUseCase()
      const updatedUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      )

      return ok(updatedUser)
    } catch (error) {
      if (error instanceof EmailExistsError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return serverError()
    }
  }
}
