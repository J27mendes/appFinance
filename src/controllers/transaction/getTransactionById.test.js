import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './getTransactionUserByIdController'

describe('Get Transaction By User Id Controller', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return {
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      }
    }
  }
  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub()
    const sut = new GetTransactionByUserIdController(getUserByIdUseCase)

    return { sut, getUserByIdUseCase }
  }

  it('should return 200 when finding transaction by user id successfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(200)
  })
})
