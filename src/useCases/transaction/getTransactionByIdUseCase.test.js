import { faker } from '@faker-js/faker'
import { GetTransactionByIdUseCase } from './getTransactionByIdUseCase.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

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

  it('should throw UserNotFoundError if user does not exist', async () => {
    //arrange
    const { sut, getUserIdRepository } = makeSut()
    jest.spyOn(getUserIdRepository, 'execute').mockResolvedValueOnce(null)
    const id = faker.string.uuid()

    //act
    const promise = sut.execute(id)

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(id))
  })
})
