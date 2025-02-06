import { UserNotFoundError } from '../../errors';
import { LoginUserUseCase } from './loginUser';

describe('LoginUserUseCase', () => {
  class PostgresCompareEmailStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const postgresCompareEmailStub = new PostgresCompareEmailStub();
    const sut = new LoginUserUseCase(postgresCompareEmailStub);
    return { sut, postgresCompareEmailStub };
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
});
