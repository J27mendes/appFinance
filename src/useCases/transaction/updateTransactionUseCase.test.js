import { UpdateTransactionUseCase } from './updateTransactionUseCase';
import { transaction } from '../../tests/fixtures/index';

describe('UpdateTransactionUseCase', () => {
  const transactionId = transaction.id;

  class UpdateTransactionRepositoryStub {
    async execute(transactionId, transaction) {
      return { transactionId, transaction };
    }
  }

  class GetTransactionByIdStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const getTransactionById = new GetTransactionByIdStub();
    const sut = new UpdateTransactionUseCase(
      updateTransactionRepository,
      getTransactionById,
    );

    return {
      sut,
      updateTransactionRepository,
      getTransactionById,
    };
  };

  it('should update a transaction successfully when valid parameters are provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transactionId, transaction);

    //assert
    expect(result).toEqual({ transactionId, transaction });
  });

  it('should throw if UpdateTransactionRepository throws', async () => {
    //arrange
    const { sut, updateTransactionRepository } = makeSut();
    import.meta.jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const id = transaction.id;

    //act
    const promise = sut.execute(id);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should call UpdateTransactionRpository with correct params', async () => {
    //arrange
    const { sut, updateTransactionRepository } = makeSut();
    const updateTransactionRepositorySpy = import.meta.jest.spyOn(
      updateTransactionRepository,
      'execute',
    );

    //act
    await sut.execute(transactionId, {
      amount: transaction.amount,
    });

    //assert
    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transactionId, {
      amount: transaction.amount,
    });
  });
});
