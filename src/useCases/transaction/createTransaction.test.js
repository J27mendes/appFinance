import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './createTransaction'
import { UserNotFoundError } from '../../errors/userNotFoundError'

describe('CreateTransactionUseCase', () => {
  const transaction = {
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
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
})
