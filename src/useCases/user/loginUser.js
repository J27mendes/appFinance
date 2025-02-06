import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js';

export class LoginUserUseCase {
  constructor(postgresCompareEmail, passwordComparatorAdapter) {
    this.postgresCompareEmail = postgresCompareEmail;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
  }
  async execute(email, password) {
    const user = await this.postgresCompareEmail.execute(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const passwordIsValid =
      await this.passwordComparatorAdapter.execute(password);
    if (!passwordIsValid) {
      throw new InvalidPasswordError();
    }
  }
}
