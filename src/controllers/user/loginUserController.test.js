import { user } from '../../tests/fixtures';
import { LoginUserController } from './loginUser';

describe('LoginUserController', () => {
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
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
      },
    };
    const response = await sut.execute(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.body.tokens.accessToken).toBe('any_access_token');
    expect(response.body.tokens.refreshToken).toBe('any_refresh_token');
  });
});
