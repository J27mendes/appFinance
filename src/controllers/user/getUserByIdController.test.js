import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './getUserById'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('GetUserByIdController', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      }
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub()
    const sut = new GetUserByIdController(getUserByIdUseCase)

    return { sut, getUserByIdUseCase }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 if a user is found', async () => {
    //arrange
    const { sut } = makeSut()
    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    })
    //assert
    expect(result.statusCode).toBe(200)
  })

  it('should return 400 if an invalid id is provided', async () => {
    //arrange
    const { sut } = makeSut()
    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } })
    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 404 id user is not found', async () => {
    //arrange
    const { sut, getUserByIdUseCase } = makeSut()
    jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(404)
  })

  it('Should return 500 if getUserBalance thorws', async () => {
    //arrange
    const { sut, getUserByIdUseCase } = makeSut()
    jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(new Error())

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(500)
  })
})
