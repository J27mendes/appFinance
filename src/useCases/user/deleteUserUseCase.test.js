import { DeleteUserUseCase } from './deleteUserUseCase.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'
import { user } from '../../tests/fixtures/index.js'

describe('DeleteUserUseCase', () => {
  class DeleteUserRepositoyStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoyStub()
    const sut = new DeleteUserUseCase(deleteUserRepository)

    return {
      sut,
      deleteUserRepository,
    }
  }

  it('should succefully delete a user', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const deletedUser = await sut.execute(user.id)

    //assert
    expect(deletedUser).toEqual(user)
  })

  it('should call DeleteUserUseCase with correct params', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut()
    const executeSpy = jest.spyOn(deleteUserRepository, 'execute')
    const userId = user.id

    //act
    await sut.execute(userId)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('Should throw UserNotFoundError when user is not found', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut()
    const userId = user.id
    const userNotFoundError = new UserNotFoundError(userId)

    jest
      .spyOn(deleteUserRepository, 'execute')
      .mockRejectedValueOnce(userNotFoundError)

    // Act & Assert
    await expect(sut.execute(userId)).rejects.toThrow(UserNotFoundError)
  })

  it('Should throw a generic error when deleteUserRepository fails unexpectedly', async () => {
    // Arrange
    const { sut, deleteUserRepository } = makeSut()
    const userId = user.id
    const unexpectedError = new Error('Unexpected error')

    jest
      .spyOn(deleteUserRepository, 'execute')
      .mockRejectedValueOnce(unexpectedError)

    // Act & Assert
    await expect(sut.execute(userId)).rejects.toThrow('Failed to delete user')
  })
})
