import { DeleteUserUseCase } from './deleteUserUseCase.js';
import { UserNotFoundError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/index.js';

describe('DeleteUserUseCase', () => {
  class DeleteUserRepositoyStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoyStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return {
      sut,
      deleteUserRepository,
    };
  };

  it('should succefully delete a user', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const deletedUser = await sut.execute(user.id);

    //assert
    expect(deletedUser).toEqual(user);
  });

  it('should call DeleteUserUseCase with correct params', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut();
    const executeSpy = import.meta.jest.spyOn(deleteUserRepository, 'execute');
    const userId = user.id;

    //act
    await sut.execute(userId);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('Should throw UserNotFoundError when user is not found', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut();
    const userId = user.id;

    import.meta.jest
      .spyOn(deleteUserRepository, 'execute')
      .mockResolvedValueOnce(null);

    // Act & Assert
    await expect(sut.execute(userId)).rejects.toThrow(UserNotFoundError);
  });
});
