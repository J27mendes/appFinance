import { ZodError } from 'zod';
import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { user } from '../../tests/fixtures';
import { LoginUserController } from './loginUser';
import { loginSchema } from '../../schemas/index';

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

  it('should return 404 if user not found', async () => {
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

  it('should return 400 if instanceof ZodError', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: { email: 'invalid-email', password: 'short' }, // Dados inválidos para disparar erro
    };

    const zodError = new ZodError([
      { path: ['email'], message: 'Invalid email format' },
    ]);

    import.meta.jest
      .spyOn(loginSchema, 'parseAsync')
      .mockRejectedValueOnce(zodError);

    // Act
    const response = await sut.execute(httpRequest);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid email format' });
  });
});
