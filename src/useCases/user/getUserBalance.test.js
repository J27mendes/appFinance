import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './getUserBalanceUseCase'

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
})
