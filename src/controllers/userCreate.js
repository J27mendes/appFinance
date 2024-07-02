import { CreateUserUseCase } from '../useCases/createUser.js'
import { PostgresCompareEmail } from '../repositories/postgres/compareEmail.js'
import validator from 'validator'
import { badRequest, created, serverError } from './helpers.js'

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      //validar a requisição (campos obrigatiorios, tamanho de senha e e-mail}
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsValid = params.password.length < 6

      if (passwordIsValid) {
        return badRequest({ message: 'Password must be at least 6 characters' })
      }
      // Verificar se o email já está em uso
      const postgresCompareEmail = new PostgresCompareEmail()
      const emailExistsResult = await postgresCompareEmail.execute(params.email)
      const emailExists = emailExistsResult[0].exists
      if (emailExists) {
        return badRequest({
          message: 'Email already in use. Please choose another one.',
        })
      }

      const emailIsValid = validator.isEmail(params.email)

      if (!emailIsValid) {
        return badRequest({
          message: 'Invalid e-mail. Please provide a valid one.',
        })
      }
      //chamar o use case
      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)
      return created({ createdUser })
    } catch (error) {
      return serverError(error)
    }
  }
}
