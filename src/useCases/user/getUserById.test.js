import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './getUserById'

describe('GetUserById', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }
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
    const result = await sut.execute(faker.string.uuid())

    //assert
    expect(result).toEqual(user)
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
    const userId = faker.string.uuid()

    //act
    await sut.execute(userId)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(faker.string.uuid())

    //assert
    await expect(promise).rejects.toThrow()
  })
})
