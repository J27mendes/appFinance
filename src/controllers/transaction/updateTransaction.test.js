import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './updateTransactionController'

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      }
    }
  }
  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCase)

    return {
      sut,
      updateTransactionUseCase,
    }
  }

  const baseHttpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  }

  it('should return 200 when updating transaction successfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when id transaction is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: 'id_invalid' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when unallowed field is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: { ...baseHttpRequest.body, unallowed: 'some_value' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when amount is not valid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: { ...baseHttpRequest.body, amount: 'amount is not valid' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })
})
