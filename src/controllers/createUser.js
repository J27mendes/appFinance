import { CreateUserUseCase } from '../useCases/createUser.js'

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      //validar a requisição (campos obrigatiorios, tamanho de senha e e-mail}
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return {
            statusCode: 400,
            body: {
              errorMessage: `Missing param:${field}`,
            },
          }
        }
      }
      //chamar o use case
      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute()
      //retornar a resposta para o usuario (status code)
      return {
        statusCode: 201,
        body: createdUser,
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: {
          errorMessage: 'Internal server error',
        },
      }
    }
  }
}
