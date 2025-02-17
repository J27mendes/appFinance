import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './getUserBalanceController.js';
import { UserNotFoundError } from '../../errors/index.js';

describe('GetUserBalanceController', () => {
  class GetUserBalanceUseCaseStub {
    async execute() {
      return faker.number.int();
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return { getUserBalanceUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    query: {
      from: '2024-01-02',
      to: '2024-01-22',
    },
  };

  it('Should return 200 when getting user balance', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const httpResponse = await sut.execute(httpRequest);

    //assert
    expect(httpResponse.statusCode).toBe(200);
  });

  it('Should call getUserBalanceUseCase with correct params', async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(getUserBalanceUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.query.from,
      httpRequest.query.to,
    );
  });

  it('Should return 400 if id is not valid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      params: { userId: 'id_invalid' },
      query: { from: '2024-01-02', to: '2024-01-22' },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 404 if id user is not found', async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId));

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(404);
  });

  it('Should return 500 if getUserBalance thorws', async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });
});
