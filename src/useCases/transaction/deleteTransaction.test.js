import { DeleteTransactionUseCase } from './deleteTransactionUseCase';
import { transaction } from '../../tests/fixtures/index';
import { faker } from '@faker-js/faker';

describe('DeleteTransaction', () => {
  const user_id = faker.string.uuid();
  class DeleteTransactionRepositoryStub {
    async execute() {
      return { ...transaction, user_id };
    }
  }
  class GetTransactionByIdRepositoryStub {
    async execute() {
      return { ...transaction, user_id };
    }
  }

  const makeSut = () => {
    const getTransactionByIdRepository = new GetTransactionByIdRepositoryStub();
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(
      deleteTransactionRepository,
      getTransactionByIdRepository,
    );

    return {
      sut,
      deleteTransactionRepository,
      getTransactionByIdRepository,
    };
  };

  it('should deleteTransaction when user found', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transaction, user_id);

    //assert
    expect(result).toEqual({ ...transaction, user_id });
  });

  it('should call DeleteTransactionRepository with correct params', async () => {
    //arrange
    const { sut, deleteTransactionRepository } = makeSut();
    const deleteTransactionRepositorySpy = import.meta.jest.spyOn(
      deleteTransactionRepository,
      'execute',
    );
    const id = faker.string.uuid();

    //act
    await sut.execute(id, user_id);

    //assert
    expect(deleteTransactionRepositorySpy).toHaveBeenLastCalledWith(id);
  });

  it('should throw if DeleteTransactionRepository throws', async () => {
    //arrange
    const { sut, deleteTransactionRepository } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    const id = faker.string.uuid();

    //act
    const promise = sut.execute(id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
