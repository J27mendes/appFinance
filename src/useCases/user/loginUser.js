import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';

export class LoginUserUseCase {
  constructor(
    postgresCompareEmail,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  ) {
    this.postgresCompareEmail = postgresCompareEmail;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }
  async execute(email, password) {
    const user = await this.postgresCompareEmail.execute(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const passwordIsValid = this.passwordComparatorAdapter.execute(
      password,
      user.password,
    );
    if (!passwordIsValid) {
      throw new InvalidPasswordError();
    }

    return {
      ...user,
      tokens: this.tokensGeneratorAdapter.execute(user.id),
    };
  }
}
