import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './createTransaction'

describe('CreateTransactionUseCase', () => {
  const transaction = {
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }
  class CreateTransactionRepositoryStub {
    async execute() {
      return transaction
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return 'randon_id'
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return { ...transaction, user_id: faker.string.uuid() }
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

  it('should returns transaction', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const createTransaction = await sut.execute(transaction)

    //assert
    expect(createTransaction).toEqual(transaction)
  })
})
