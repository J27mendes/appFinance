import { GetTransactionByIdUseCase } from './getTransactionByIdUseCase.js';
import { UserNotFoundError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/index.js';

describe('GetTransactionByIdUseCase', () => {
  class PostgresGetTransactionByIdRepositoryStub {
    async execute() {
      return [];
    }
  }

  class GetUserIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const postgresGetTransactionByIdRepository =
      new PostgresGetTransactionByIdRepositoryStub();
    const getUserIdRepository = new GetUserIdRepositoryStub();
    const sut = new GetTransactionByIdUseCase(
      postgresGetTransactionByIdRepository,
      getUserIdRepository,
    );

    return {
      sut,
      postgresGetTransactionByIdRepository,
      getUserIdRepository,
    };
  };
  it('should the returns success when the user is found', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(user.id);

    //assert
    expect(result).toEqual([]);
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    //arrange
    const { sut, getUserIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserIdRepository, 'execute')
      .mockResolvedValueOnce(null);
    const id = user.id;

    //act
    const promise = sut.execute(id);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(id));
  });

  it('should call GetUserIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserIdRepository } = makeSut();
    const getUserIdRepositorySpy = import.meta.jest.spyOn(
      getUserIdRepository,
      'execute',
    );

    const id = user.id;

    //act
    await sut.execute(id);

    //assert
    expect(getUserIdRepositorySpy).toHaveBeenCalledWith(id);
  });

  it('should call PostgresGetTransactionByIdRepository with correct params', async () => {
    //arrange
    const { sut, postgresGetTransactionByIdRepository } = makeSut();
    const postgresGetTransactionByIdRepositorySpy = import.meta.jest.spyOn(
      postgresGetTransactionByIdRepository,
      'execute',
    );

    const id = user.id;
    const from = '2024-06-27';
    const to = '2024-07-08';

    //act
    await sut.execute(id, from, to);

    //assert
    expect(postgresGetTransactionByIdRepositorySpy).toHaveBeenCalledWith(
      id,
      from,
      to,
    );
  });

  it('should throw if PostgresGetTransactionByIdRepository throws', async () => {
    //arrange
    const { sut, postgresGetTransactionByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(postgresGetTransactionByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const id = user.id;

    //act
    const promise = sut.execute(id);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserIdRepository throws', async () => {
    //arrange
    const { sut, getUserIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const id = user.id;

    //act
    const promise = sut.execute(id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
