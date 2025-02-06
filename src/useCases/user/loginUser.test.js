import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { LoginUserUseCase } from './loginUser';
import { user } from '../../tests/fixtures/index.js';

describe('LoginUserUseCase', () => {
  class PostgresCompareEmailStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true;
    }
  }

  const makeSut = () => {
    const postgresCompareEmailStub = new PostgresCompareEmailStub();
    const passwordComparatorAdapterStub = new PasswordComparatorAdapterStub();
    const sut = new LoginUserUseCase(
      postgresCompareEmailStub,
      passwordComparatorAdapterStub,
    );
    return { sut, postgresCompareEmailStub, passwordComparatorAdapterStub };
  };

  it('should throw UserNotFoundError if user is not found', async () => {
    //arrange
    const { sut, postgresCompareEmailStub } = makeSut();
    import.meta.jest
      .spyOn(postgresCompareEmailStub, 'execute')
      .mockResolvedValueOnce(null);

    //act
    const promise = sut.execute('any_email', 'any_password');

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('should throw InvalidPasswordError if password is invalid', async () => {
    //arrange
    const { sut, passwordComparatorAdapterStub } = makeSut();
    import.meta.jest
      .spyOn(passwordComparatorAdapterStub, 'execute')
      .mockReturnValue(false);

    //act
    const promise = sut.execute('any_email', 'any_password');

    //assert
    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });
});
