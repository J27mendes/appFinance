import { UserNotFoundError } from '../errors/userNotFoundError.js'
import {
  invalidIdResponse,
  userNotFoundResponse,
  ok,
  serverError,
  checkIfEmailIsValid,
} from './helpers/index.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = checkIfEmailIsValid(httpRequest.userId)

      if (!userId || typeof userId !== 'string' || !isIdValid) {
        return invalidIdResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId)

      return ok(deletedUser)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse(httpRequest.params.userId)
      }
      console.error('Error in delete user controller:', error)
      return serverError()
    }
  }
}
