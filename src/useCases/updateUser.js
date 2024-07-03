import bcrypt from 'bcrypt'
import { EmailExistsError } from '../errors/user.js'
import { PostgresCompareEmail } from '../repositories/postgres/compareEmail.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/updateUser.js'

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresCompareEmail = new PostgresCompareEmail()
      const emailExists = await postgresCompareEmail.execute(
        updateUserParams.email,
      )

      if (emailExists) {
        throw new EmailExistsError(updateUserParams.email)
      }
    }
    const user = { ...updateUserParams }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashedPassword
    }
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
    const updateUser = await postgresUpdateUserRepository.execute(userId, user)

    return updateUser
  }
}
