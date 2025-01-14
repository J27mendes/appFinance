import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './updateTransactionUseCase'

describe('UpdateTransactionUseCase', () => {
  const transactionId = faker.string.uuid()
  const params = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  class UpdateTransactionRepositoryStub {
    async execute(transactionId, params) {
      return { transactionId, params }
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub()
    const sut = new UpdateTransactionUseCase(updateTransactionRepository)

    return {
      sut,
      updateTransactionRepository,
    }
  }

  it('should update a transaction successfully when valid parameters are provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(transactionId, params)

    //assert
    expect(result).toEqual({ transactionId, params })
  })

  it('should throw if UpdateTransactionRepository throws', async () => {
    //arrange
    const { sut, updateTransactionRepository } = makeSut()
    jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    const id = faker.string.uuid()

    //act
    const promise = sut.execute(id)

    //assert
    await expect(promise).rejects.toThrow()
  })

  it('should call UpdateTransactionRpository with correct params', async () => {
    //arrange
    const { sut, updateTransactionRepository } = makeSut()
    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      'execute',
    )

    //act
    await sut.execute(transactionId, {
      amount: params.amount,
    })

    //assert
    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transactionId, {
      amount: params.amount,
    })
  })
})
