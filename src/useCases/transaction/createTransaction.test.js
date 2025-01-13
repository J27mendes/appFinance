import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './createTransaction.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('CreateTransactionUseCase', () => {
  const transaction = {
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  class CreateTransactionRepositoryStub {
    async execute(transaction) {
      return transaction
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return 'random_id'
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return { ...transaction, id: faker.string.uuid() }
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    )

    return {
      sut,
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    }
  }

  it('should returns transaction succefully', async () => {
    //arrange
    const { sut, idGeneratorAdapter, createTransactionRepository } = makeSut()
    jest.spyOn(idGeneratorAdapter, 'execute').mockReturnValue('random_id')

    // Mockar o retorno do createTransactionRepository
    jest.spyOn(createTransactionRepository, 'execute').mockResolvedValue({
      ...transaction,
      id: 'random_id',
    })

    //act
    const createTransaction = await sut.execute(transaction)

    //assert
    expect(createTransaction).toEqual({ ...transaction, id: 'random_id' })
  })

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      'execute',
    )

    //act
    await sut.execute(transaction)

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(transaction.userId)
  })

  it('should call IdGeneratorAdapter', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut()
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

    //act
    await sut.execute(transaction)

    //assert
    expect(idGeneratorAdapterSpy).toHaveBeenCalled()
  })

  it('should throw UserNotFoundError if user does not exists', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

    //act
    const promise = sut.execute(transaction)

    //assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(transaction.userId),
    )
  })

  it('should throw if GetUserByIdRepository throw', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const promise = sut.execute(transaction)

    //assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if IdGenerator throws', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut()
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    //act
    const promise = sut.execute(transaction)

    //assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if CreateTransactionRepository throws', async () => {
    //arrange
    const { sut, createTransactionRepository } = makeSut()
    jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const promise = sut.execute(transaction)

    //assert
    await expect(promise).rejects.toThrow()
  })
})
