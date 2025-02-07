import { DeleteTransactionUseCase } from './deleteTransactionUseCase';
import { transaction } from '../../tests/fixtures/index';
import { TransactionNotFoundError } from '../../errors/index';

describe('DeleteTransaction', () => {
  class DeleteTransactionRepositoryStub {
    async execute() {
      return { transaction };
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

    return {
      sut,
      deleteTransactionRepository,
    };
  };

  it('should deleteTransaction when user found', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transaction);

    //assert
    expect(result).toEqual({ transaction });
  });

  it('should the user cannot be found, receive the error TransactionNotFoundError', async () => {
    //arrange
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = transaction.id;
    import.meta.jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockResolvedValueOnce(null);

    // Act & Assert
    await expect(sut.execute(transactionId)).rejects.toThrow(
      TransactionNotFoundError,
    );
  });
});
