import { EmailExistsError } from '../../errors/user.js'
import { updateUserSchena } from '../../schemas/user.js'
import {
  badRequest,
  ok,
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
} from '../helpers/index.js'
import { ZodError } from 'zod'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }
      const params = httpRequest.body

      await updateUserSchena.parseAsync(params)

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updatedUser)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }
      if (error instanceof EmailExistsError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return serverError()
    }
  }
}
