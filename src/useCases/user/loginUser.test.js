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

  class TokensGeneratorAdapterStub {
    execute() {
      return {
        accesToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      };
    }
  }

  const makeSut = () => {
    const postgresCompareEmailStub = new PostgresCompareEmailStub();
    const passwordComparatorAdapterStub = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();
    const sut = new LoginUserUseCase(
      postgresCompareEmailStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    );
    return {
      sut,
      postgresCompareEmailStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    };
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

  it('should return user with tokens', async () => {
    const { sut } = makeSut();
    const result = await sut.execute('any_email', 'any_password');
    expect(result.tokens.accesToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();
  });
});
