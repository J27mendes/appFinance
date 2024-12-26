import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from '../transaction/deleteTransaction.js'

describe('Delete Transaction Controller', () => {
  class DeleteTransactionUseCaseStub {
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
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
    const sut = new DeleteTransactionController(deleteTransactionUseCase)

    return { sut, deleteTransactionUseCase }
  }

  it('should returns 200 when deleting a transaction successfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(200)
  })

  it('should returns 400 if id is invalid', async () => {
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: 'invalid_id' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should returns 400 if id is not found', async () => {
    const { sut, deleteTransactionUseCase } = makeSut()
    jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(null)

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should returns 500 when DeleteTransactionController throws', async () => {
    const { sut, deleteTransactionUseCase } = makeSut()
    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValue(new Error())

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(500)
  })
})