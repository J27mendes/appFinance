import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { user } from '../../tests/fixtures';
import { LoginUserController } from './loginUser';

describe('LoginUserController', () => {
  const httpRequest = {
    body: {
      email: 'any@email.com',
      password: 'any_password',
    },
  };
  class LoginUserUseCaseStub {
    async execute() {
      return {
        ...user,
        tokens: {
          accessToken: 'any_access_token',
          refreshToken: 'any_refresh_token',
        },
      };
    }
  }

  const makeSut = () => {
    const loginUserUseCase = new LoginUserUseCaseStub();
    const sut = new LoginUserController(loginUserUseCase);
    return { sut, loginUserUseCase };
  };

  it('should return 200 with user and tokens', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(200);
    expect(response.body.tokens.accessToken).toBe('any_access_token');
    expect(response.body.tokens.refreshToken).toBe('any_refresh_token');
  });

  it('should return 401 if password is invalid', async () => {
    //arrange
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new InvalidPasswordError());

    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if password is invalid', async () => {
    //arrange
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError());

    //act
    const response = await sut.execute(httpRequest);

    //assert
    expect(response.statusCode).toBe(404);
  });

  it('should return 500 if a server error occurs', async () => {
    //arrange
    const { sut, loginUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(loginUserUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });
});
