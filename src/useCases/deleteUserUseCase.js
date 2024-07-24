import { UserNotFoundError } from '../errors/userNotFoundError.js'

export class DeleteUserUseCase {
  constructor(deleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }

  async execute(userId) {
    try {
      const deletedUser = await this.deleteUserRepository.execute(userId)
      return deletedUser
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error // Lançar erro específico de usuário não encontrado
      }
      throw new Error('Failed to delete user') // Outros erros genéricos
    }
  }
}
