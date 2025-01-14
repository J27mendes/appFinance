import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './getUserBalanceUseCase'
import { UserNotFoundError } from '../../errors/userNotFoundError'

describe('GetUserBalanceUseCase', () => {
  const userBalance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  }
  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance
    }
  }
  class GetUserByIdRepositoryStub {
    async execute() {
      return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      }
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    )

    return { sut, getUserBalanceRepository, getUserByIdRepository }
  }

  it('should be successful when searching for the user with the getUserBalance', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid())

    //assert
    expect(result).toEqual(userBalance)
  })

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    //arange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
    const userId = faker.string.uuid()

    //act
    const promise = sut.execute(userId)

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const userId = faker.string.uuid()
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      'execute',
    )

    //act
    await sut.execute(userId)

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
  })

  it('should call GetUserBalanceRepository with correct params', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut()
    const userId = faker.string.uuid()
    const getUserBalanceRepositorySpy = jest.spyOn(
      getUserBalanceRepository,
      'execute',
    )

    //act
    await sut.execute(userId)

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(userId)
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

  it('should throw if GetUserBalanceRepository throws', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut()
    jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error())

    //act
    const promise = sut.execute(faker.string.uuid())

    //assert
    await expect(promise).rejects.toThrow()
  })
})
