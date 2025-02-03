import { GetUserBalanceUseCase } from './getUserBalanceUseCase';
import { UserNotFoundError } from '../../errors/userNotFoundError';
import { userBalance } from '../../tests/fixtures/index';
import { user } from '../../tests/fixtures/index';

describe('GetUserBalanceUseCase', () => {
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
    const result = await sut.execute(user.id);

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
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = import.meta.jest.spyOn(
      getUserByIdRepository,
      'execute',
    );

    //act
    await sut.execute(user.id);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id);
  });

  it('should call GetUserBalanceRepository with correct params', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const getUserBalanceRepositorySpy = import.meta.jest.spyOn(
      getUserBalanceRepository,
      'execute',
    );

    //act
    await sut.execute(user.id);

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(user.id);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserBalanceRepository throws', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
