import { GetUserByIdUseCase } from '../useCases/getUserById'
import { badRequest, ok, serverError } from './helpers'
import validator from 'validator'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The provided id is not valid',
        })
      }
      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)
      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}