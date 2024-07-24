import { UserNotFoundError } from '../errors/userNotFoundError.js'
import {
  invalidIdResponse,
  userNotFoundResponse,
  ok,
  serverError,
} from './helpers/index.js' // Importe seus helpers conforme necessário

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      // Verificar se o ID é válido (exemplo de validação)
      if (!userId || typeof userId !== 'string') {
        return invalidIdResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId)

      return ok(deletedUser) // Retorna a resposta de sucesso
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse(httpRequest.params.userId) // Retorna resposta de usuário não encontrado
      }
      console.error('Error in delete user controller:', error)
      return serverError() // Retorna resposta de erro genérico
    }
  }
}
