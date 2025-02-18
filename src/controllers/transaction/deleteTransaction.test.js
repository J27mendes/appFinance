import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from '../transaction/deleteTransaction.js';
import { TransactionNotFoundError } from '../../errors/transactionNotFoundError.js';

describe('Delete Transaction Controller', () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      };
    }
  }

  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return { sut, deleteTransactionUseCase };
  };

  it('should returns 200 when deleting a transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
        user_id: faker.string.uuid(),
      },
    });

    //assert
    expect(response.statusCode).toBe(200);
  });

  it('should call DeleteTransactionUseCase with correct params', async () => {
    //arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      deleteTransactionUseCase,
      'execute',
    );

    const transactionId = faker.string.uuid();
    const userId = faker.string.uuid();

    //act
    await sut.execute({
      params: { transactionId: transactionId, user_id: userId },
    });

    //assert
    expect(executeSpy).toHaveBeenCalledWith(transactionId, userId);
  });

  it('should returns 400 if id is invalid', async () => {
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      params: { transactionId: 'invalid_id', user_id: 'invalid_id' },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should returns 400 if id is not found', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockResolvedValueOnce(null);

    //act
    const response = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
        user_id: faker.string.uuid(),
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Transaction not found');
  });

  it('should returns 404 if transaction_id is not found', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(
        new TransactionNotFoundError('Transaction not found'),
      );

    //act
    const response = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
        user_id: faker.string.uuid(),
      },
    });

    //assert
    expect(response.statusCode).toBe(404);
  });

  it('should returns 500 when DeleteTransactionController throws', async () => {
    const { sut, deleteTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValue(new Error());

    //act
    const response = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
        userId: faker.string.uuid(),
      },
    });

    //assert
    expect(response.statusCode).toBe(500);
  });

  it('should return correct error message when id is invalid', async () => {
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      params: {
        transactionId: 'The provided id is not valid.',
        user_id: 'The provided id is not valid',
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('The provided id is not valid.'); // Ajuste conforme a mensagem real da sua função `invalidIdResponse`
  });
});
