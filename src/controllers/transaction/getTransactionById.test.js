import { faker } from '@faker-js/faker';
import { GetTransactionByUserIdController } from './getTransactionUserByIdController.js';
import { UserNotFoundError } from '../../errors/index.js';

describe('Get Transaction By User Id Controller', () => {
  const from = '2024-01-01';
  const to = '2024-02-20';
  class GetUserByIdUseCaseStub {
    async execute() {
      return {
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      };
    }
  }
  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetTransactionByUserIdController(getUserByIdUseCase);

    return { sut, getUserByIdUseCase };
  };

  it('should return 200 when finding transaction by user id successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid(), from, to },
    });

    //assert
    expect(response.statusCode).toBe(200);
  });

  it('should call getUserByIdUseCase witch correct params', async () => {
    //arrange
    const { sut, getUserByIdUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute({
      query: { userId, from, to },
    });

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId, from, to);
  });

  it('should return 400 when missing UserId params', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      query: { userId: undefined, from, to },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when userId param is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const response = await sut.execute({
      query: { userId: 'invalid_User_Id', from, to },
    });

    //assert
    expect(response.statusCode).toBe(400);
  });

  it('should return 404 when user is not found', async () => {
    //arrange
    const { sut, getUserByIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError('Transaction is not found'));

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid(), from, to },
    });

    //assert
    expect(response.statusCode).toBe(404);
  });

  it('should return 500 when exist a server error', async () => {
    //arrange
    const { sut, getUserByIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValue(new Error());

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid(), from, to },
    });

    //assert
    expect(response.statusCode).toBe(500);
  });
});
