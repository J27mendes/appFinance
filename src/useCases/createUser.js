import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailExistsError } from '../errors/user.js'
import {
  PostgresCreateUserRepository,
  PostgresCompareEmail,
} from '../repositories/postgres/index.js'
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
