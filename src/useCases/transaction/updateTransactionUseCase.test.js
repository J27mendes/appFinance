import { UpdateTransactionUseCase } from './updateTransactionUseCase';
import { transaction } from '../../tests/fixtures/index';
import { ForbiddenError } from '../../errors';

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

  it('should return a forbiddenError if transaction.id is not equal to params.id', async () => {
    //arrange
    const { sut, getTransactionById } = makeSut();
    import.meta.jest
      .spyOn(getTransactionById, 'execute')
      .mockResolvedValueOnce({
        id: 'some_transaction_id',
        user_id: 'another_user_id',
      });

    const params = { userId: 'user_id_not_matching' };

    // act
    const promise = sut.execute('some_transaction_id', params);

    // assert
    await expect(promise).rejects.toThrow(ForbiddenError);
  });
});
