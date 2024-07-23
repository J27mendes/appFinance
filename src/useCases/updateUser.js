import bcrypt from 'bcrypt'
import { EmailExistsError } from '../errors/user.js'

export class UpdateUserUseCase {
  constructor(postgresCompareEmail, postgresUpdateUserRepository) {
    this.postgresCompareEmail = postgresCompareEmail
    this.postgresUpdateUserRepository = postgresUpdateUserRepository
  }
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const emailExists = await this.postgresCompareEmail.execute(
        updateUserParams.email,
      )

      if (emailExists && emailExists.id !== userId) {
        throw new EmailExistsError(updateUserParams.email)
      }
    }
    const user = { ...updateUserParams }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashedPassword
    }
    const updateUser = await this.postgresUpdateUserRepository.execute(
      userId,
      user,
    )

    return updateUser
  }
}
