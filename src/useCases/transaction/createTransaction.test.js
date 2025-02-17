import { CreateTransactionUseCase } from './createTransaction.js';
import { UserNotFoundError } from '../../errors/index.js';
import { transaction } from '../../tests/fixtures/index.js';

describe('CreateTransactionUseCase', () => {
  class CreateTransactionRepositoryStub {
    async execute() {
      return transaction;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return 'random_id';
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return { transaction };
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      sut,
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    };
  };

  it('should returns transaction succefully', async () => {
    //arrange
    const { sut, idGeneratorAdapter, createTransactionRepository } = makeSut();
    import.meta.jest
      .spyOn(idGeneratorAdapter, 'execute')
      .mockReturnValue('random_id');

    // Mockar o retorno do createTransactionRepository
    import.meta.jest
      .spyOn(createTransactionRepository, 'execute')
      .mockResolvedValue({
        ...transaction,
        id: 'random_id',
      });

    //act
    const createTransaction = await sut.execute(transaction);

    //assert
    expect(createTransaction).toEqual({ ...transaction, id: 'random_id' });
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = import.meta.jest.spyOn(
      getUserByIdRepository,
      'execute',
    );

    //act
    await sut.execute(transaction);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(transaction.userId);
  });

  it('should call IdGeneratorAdapter', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = import.meta.jest.spyOn(
      idGeneratorAdapter,
      'execute',
    );

    //act
    await sut.execute(transaction);

    //assert
    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it('should throw UserNotFoundError if user does not exists', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockResolvedValue(null);

    //act
    const promise = sut.execute(transaction);

    //assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(transaction.userId),
    );
  });

  it('should throw if GetUserByIdRepository throw', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGenerator throws', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut();
    import.meta.jest
      .spyOn(idGeneratorAdapter, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    //act
    const promise = sut.execute(transaction);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if CreateTransactionRepository throws', async () => {
    //arrange
    const { sut, createTransactionRepository } = makeSut();
    import.meta.jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
