import { EmailExistsError } from '../../errors/user.js';
export class CreateUserUseCase {
  constructor(
    postgresCompareEmail,
    postgresCreateUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  ) {
    this.postgresCompareEmail = postgresCompareEmail;
    this.postgresCreateUserRepository = postgresCreateUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }
  async execute(createUserParams) {
    const emailExists = await this.postgresCompareEmail.execute(
      createUserParams.email,
    );
    if (emailExists) {
      throw new EmailExistsError(createUserParams.email);
    }

    const userId = this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.postgresCreateUserRepository.execute(user);

    return createdUser;
  }
}
