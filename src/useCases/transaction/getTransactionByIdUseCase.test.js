import { faker } from '@faker-js/faker'
import { GetTransactionByIdUseCase } from './getTransactionByIdUseCase'

describe('GetTransactionByIdUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class PostgresGetTransactionByIdRepository {
    async execute() {
      return []
    }
  }

  class GetUserIdRepository {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const postgresGetTransactionByIdRepository =
      new PostgresGetTransactionByIdRepository()
    const getUserIdRepository = new GetUserIdRepository()
    const sut = new GetTransactionByIdUseCase(
      postgresGetTransactionByIdRepository,
      getUserIdRepository,
    )

    return { sut, postgresGetTransactionByIdRepository, getUserIdRepository }
  }
  it('should the returns success when the user is found', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid())

    //assert
    expect(result).toEqual([])
  })
})
