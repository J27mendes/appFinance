import { GetUserByIdUseCase } from './getUserById'
import { user } from '../../tests/fixtures/index'

describe('GetUserById', () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }
  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdRepository)

    return { sut, getUserByIdRepository }
  }

  it('must ensure that the user id is provided successfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(user.id)

    //assert
    expect(result).toEqual(user)
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    //act
    await sut.execute(user.id)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(user.id)

    //assert
    await expect(promise).rejects.toThrow()
  })
})
