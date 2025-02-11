import { UnauthorizedError } from '../../errors';
import { RefreshTokenController } from './refreshToken';

describe('RefreshTokenController', () => {
  class RefreshTokenUseCaseStub {
    execute() {
      return {
        accessToken: 'valid_access_token',
        refreshToken: 'valid_refresh_token',
      };
    }
  }

  const makeSut = () => {
    const refreshTokenUseCase = new RefreshTokenUseCaseStub();
    const sut = new RefreshTokenController(refreshTokenUseCase);

    return {
      sut,
      refreshTokenUseCase,
    };
  };

  it('should return 400 if refresh token is invalid', async () => {
    //arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        refreshToken: 2,
      },
    };

    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 if refresh token is valid', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        refreshToken: 'valid_refresh_token',
      },
    };

    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(200);
  });

  it('should return 401 if throws UnauthorizesError', async () => {
    const { sut, refreshTokenUseCase } = makeSut();
    import.meta.jest
      .spyOn(refreshTokenUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new UnauthorizedError();
      });
    const httpRequest = {
      body: {
        refreshToken: '1',
      },
    };
    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(401);
  });
});
