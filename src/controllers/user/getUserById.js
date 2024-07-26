import {
  notFound,
  ok,
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
} from '../helpers/index.js'
export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }
  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      )

      if (!user) {
        return notFound({ message: 'User not found' })
      }

      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
