import { UnauthorizedError } from '../../errors';
import { RefreshTokenUseCase } from './refreshToken';

describe('RefreshTokenUseCase', () => {
  class TokenVerifierAdapter {
    execute() {
      return true;
    }
  }

  class TokensGeneratorAdapter {
    execute() {
      return {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      };
    }
  }

  const makeSut = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter();
    const tokenVerifierAdapter = new TokenVerifierAdapter();
    const sut = new RefreshTokenUseCase(
      tokensGeneratorAdapter,
      tokenVerifierAdapter,
    );

    return {
      sut,
      tokenVerifierAdapter,
      tokensGeneratorAdapter,
    };
  };

  it('should return new tokens', () => {
    //arrange
    const { sut } = makeSut();
    const refreshToken = 'any_refresh_token';
    const result = sut.execute(refreshToken);

    //act & assert
    expect(result).toEqual({
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
    });
  });

  it('should throw unauthorized if null', () => {
    //arrange
    const { sut, tokenVerifierAdapter } = makeSut();
    import.meta.jest
      .spyOn(tokenVerifierAdapter, 'execute')
      .mockImplementationOnce(null);

    //act & assert
    expect(() => sut.execute('any_refresh_token')).toThrow(
      new UnauthorizedError(),
    );
  });

  it('should throw if tokenVerifyAdapter throws', () => {
    //arrange
    const { sut, tokenVerifierAdapter } = makeSut();
    import.meta.jest
      .spyOn(tokenVerifierAdapter, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    //act & assert
    expect(() => sut.execute('any_refresh_token')).toThrow(
      new UnauthorizedError(),
    );
  });
});
