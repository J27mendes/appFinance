import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './deleteTransactionUseCase'
import { UserNotFoundError } from '../../errors/userNotFoundError'

describe('DeleteTransaction', () => {
  const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...transaction, id: transactionId }
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

    return {
      sut,
      deleteTransactionRepository,
    }
  }

  it('should deleteTransaction when user found', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(transaction.id)

    //assert
    expect(result).toEqual({ ...transaction, id: transaction.id })
  })

  it('should the user cannot be found, receive the error UserNotFoundError', async () => {
    //arrange
    const { sut, deleteTransactionRepository } = makeSut()

    const transactionId = faker.string.uuid()
    const userNotFoundError = new UserNotFoundError(transactionId)

    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(userNotFoundError)

    // Act & Assert
    await expect(sut.execute(transactionId)).rejects.toThrow(UserNotFoundError)
  })
})
