import { faker } from '@faker-js/faker';
import { ZodError } from 'zod';
import { CreateTransactionController } from './controllerTransaction.js';

describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction;
    }
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);

    return {
      sut,
      createTransactionUseCase,
    };
  };

  const baseHttpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  };

  it('should return 201 when creating transaction successfully with type = { EXPENSE }', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute(baseHttpRequest);

    //assert
    expect(response.statusCode).toBe(201);
  });

  it('should return 201 when creating transaction successfully with type = { EARNING }', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'EARNING',
      },
    });

    //assert
    expect(response.statusCode).toBe(201);
  });

  it('should return 201 when creating transaction successfully with type = { INVESTMENT }', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'INVESTMENT',
      },
    });

    //assert
    expect(response.statusCode).toBe(201);
  });

  it('should call CreateTransactionUseCase witch correct params', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      createTransactionUseCase,
      'execute',
    );

    //act
    await sut.execute(baseHttpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body);
  });

  it('should return 400 when missing user_id', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        user_id: undefined,
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when missing name', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        name: undefined,
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when missing date', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: undefined,
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when missing type', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'undefined',
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when missing amount', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: undefined,
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when missing date invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: 'invalid_date',
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when amount is not a valid currency', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: 'invalid_amount',
      },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 500 when createTransactionUseCase throws', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const response = await sut.execute(baseHttpRequest);

    //assert
    expect(response.statusCode).toBe(500);
  });

  it('should return 400 if createTransactionUseCase throws', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut();
    const validationError = new ZodError([
      {
        path: ['field'],
        message: 'Validation error message',
        code: 'invalid_type',
      },
    ]);

    import.meta.jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw validationError;
      });

    //act
    const result = await sut.execute({
      body: {
        ...baseHttpRequest.undefined,
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when validation schema fails', async () => {
    //arrange
    const { sut } = makeSut();
    const response = await sut.execute({
      body: {
        user_id: 'invalid_uuid', // Um UUID inválido que causaria erro no Zod
        name: faker.commerce.productName(),
        date: 'invalid_date',
        type: 'UNKNOWN_TYPE', // Um tipo não reconhecido
        amount: 'invalid_amount',
      },
    });

    //act & assert
    expect(response.statusCode).toBe(400);
  });

  it('should return correct error message when validation fails', async () => {
    //arrange
    const { sut } = makeSut();
    const response = await sut.execute({
      body: { ...baseHttpRequest.body, user_id: undefined },
    });
    //act & assert
    expect(response.body.message).toBe('User ID is required.'); // Ajuste conforme a validação do Zod
  });

  it('should return a formatted error response when server error occurs', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Internal Error'));

    //act
    const response = await sut.execute(baseHttpRequest);

    //asserrt
    expect(response.statusCode).toBe(500);
    expect(response.message).toEqual('Internal server error'); // Ajuste conforme a implementação do `serverError`
  });
});
