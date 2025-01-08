import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './deleteUserUseCase.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('DeleteUserUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

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
    const deletedUser = await sut.execute(faker.string.uuid())

    //assert
    expect(deletedUser).toEqual(user)
  })

  it('should call DeleteUserUseCase with correct params', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut()
    const executeSpy = jest.spyOn(deleteUserRepository, 'execute')
    const userId = faker.string.uuid()

    //act
    await sut.execute(userId)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('Should throw UserNotFoundError when user is not found', async () => {
    //arrange
    const { sut, deleteUserRepository } = makeSut()
    const userId = faker.string.uuid()
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
    const userId = faker.string.uuid()
    const unexpectedError = new Error('Unexpected error')

    jest
      .spyOn(deleteUserRepository, 'execute')
      .mockRejectedValueOnce(unexpectedError)

    // Act & Assert
    await expect(sut.execute(userId)).rejects.toThrow('Failed to delete user')
  })
})
