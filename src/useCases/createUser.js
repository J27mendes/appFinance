import { PostgresCreateUserRepository } from '../repositories/postgres/createUser.js'
import { PostgresCompareEmail } from '../repositories/postgres/compareEmail.js'
import { EmailExistsError } from '../errors/user.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresCompareEmail = new PostgresCompareEmail()
    const emailExists = await postgresCompareEmail.execute(
      createUserParams.email,
    )
    if (emailExists) {
      throw new EmailExistsError(createUserParams.email)
    }

    const userId = uuidv4()

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    // chamar o repositorio
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createdUser = await postgresCreateUserRepository.execute(user)

    return createdUser
  }
}
