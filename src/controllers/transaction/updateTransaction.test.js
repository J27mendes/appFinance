import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from './updateTransactionController';
import { TransactionNotFoundError } from '../../errors/transactionNotFoundError';
import { ForbiddenError } from '../../errors';
import { forbidden } from '../helpers';

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
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
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return {
      sut,
      updateTransactionUseCase,
    };
  };

  const baseHttpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  };

  it('should return 200 when updating transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute(baseHttpRequest);

    //assert
    expect(response.statusCode).toBe(200);
  });

  it('should return 400 when id transaction is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      params: { transactionId: 'id_invalid' },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when amount is not valid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: { ...baseHttpRequest.body, amount: 'amount is not valid' },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when type provided is not correct', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        ...baseHttpRequest.body,
        type: 'TYPE_IS_NOT_CORRECT                                                        ',
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should call UpdateTransaction with correct params', async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      updateTransactionUseCase,
      'execute',
    );

    //act
    await sut.execute(baseHttpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(
      baseHttpRequest.params.transactionId,
      baseHttpRequest.body,
    );
  });

  it('should return 500 when exists server error', async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const response = await sut.execute({ baseHttpRequest });

    //assert
    expect(response.statusCode).toBe(500);
  });

  it('should return 404 when transactionNotFoundError is thron', async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new TransactionNotFoundError());

    //act
    const response = await sut.execute(baseHttpRequest);

    //assert
    expect(response.statusCode).toBe(404);
  });

  it('should return forbidden() if UpdateTransactionUseCase throws ForbiddenError', async () => {
    // Arrange
    const { sut, updateTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new ForbiddenError());

    const httpRequest = {
      params: { transactionId: faker.string.uuid() },
      body: { name: 'Updated Transaction', amount: 100 },
    };

    // Act
    const response = await sut.execute(httpRequest);

    // Assert
    expect(response).toEqual(forbidden());
  });
});
