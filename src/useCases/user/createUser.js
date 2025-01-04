import { v4 as uuidv4 } from 'uuid'
import { EmailExistsError } from '../../errors/user.js'
export class CreateUserUseCase {
  constructor(
    postgresCompareEmail,
    postgresCreateUserRepository,
    passwordHashedAdapter,
  ) {
    this.postgresCompareEmail = postgresCompareEmail
    this.postgresCreateUserRepository = postgresCreateUserRepository
    this.passwordHashedAdapter = passwordHashedAdapter
  }
  async execute(createUserParams) {
    const emailExists = await this.postgresCompareEmail.execute(
      createUserParams.email,
    )
    if (emailExists) {
      throw new EmailExistsError(createUserParams.email)
    }

    const userId = uuidv4()

    const hashedPassword = await this.passwordHashedAdapter.execute(
      createUserParams.password,
    )

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createdUser = await this.postgresCreateUserRepository.execute(user)

    return createdUser
  }
}
