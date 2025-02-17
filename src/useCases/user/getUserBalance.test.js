import { GetUserBalanceUseCase } from './getUserBalanceUseCase';
import { UserNotFoundError } from '../../errors/index.js';
import { userBalance } from '../../tests/fixtures/index';
import { user } from '../../tests/fixtures/index';

describe('GetUserBalanceUseCase', () => {
  const from = '2024-01-01';
  const to = '2024-01-22';
  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return { sut, getUserBalanceRepository, getUserByIdRepository };
  };

  it('should be successful when searching for the user with the getUserBalance', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(user.id, from, to);

    //assert
    expect(result).toEqual(userBalance);
  });

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    //arange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockResolvedValue(null);

    //act
    const promise = sut.execute(user.id, from, to);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });

  it('should call GetUserBalanceRepository with correct params', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const getUserBalanceRepositorySpy = import.meta.jest.spyOn(
      getUserBalanceRepository,
      'execute',
    );

    //act
    await sut.execute(user.id, from, to);

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(user.id, from, to);
  });

  it('should throw if GetUserBalanceRepository throws', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(user.id, from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
