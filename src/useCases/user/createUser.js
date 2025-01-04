import { EmailExistsError } from '../../errors/user.js'
export class CreateUserUseCase {
  constructor(
    postgresCompareEmail,
    postgresCreateUserRepository,
    passwordHashedAdapter,
    idGeneratorAdapter,
  ) {
    this.postgresCompareEmail = postgresCompareEmail
    this.postgresCreateUserRepository = postgresCreateUserRepository
    this.passwordHashedAdapter = passwordHashedAdapter
    this.idGeneratorAdapter = idGeneratorAdapter
  }
  async execute(createUserParams) {
    const emailExists = await this.postgresCompareEmail.execute(
      createUserParams.email,
    )
    if (emailExists) {
      throw new EmailExistsError(createUserParams.email)
    }

    const userId = this.idGeneratorAdapter.execute()

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
