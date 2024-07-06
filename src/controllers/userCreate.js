import { EmailExistsError } from '../errors/user.js'
import { CreateUserUseCase } from '../useCases/index.js'
import {
  badRequest,
  created,
  serverError,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
} from './helpers/index.js'
export class CreateUserController {
  async execute(httpRequest) {
    try {
      // Verificar se é um objeto JSON válido
      const params = httpRequest.body
      //validar a requisição (campos obrigatorios, tamanho de senha e e-mail}
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password)

      if (!passwordIsValid) {
        return invalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsValid(params.email)

      if (!emailIsValid) {
        return emailIsAlreadyInUseResponse()
      }
      //chamar o use case
      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)
      return created({ createdUser })
    } catch (error) {
      if (error instanceof EmailExistsError) {
        return badRequest({ message: error.message })
      }
      return serverError(error)
    }
  }
}
