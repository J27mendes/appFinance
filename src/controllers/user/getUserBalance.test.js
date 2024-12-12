import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './getUserBalanceController.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('GetUserBalanceController', () => {
  class GetUserBalanceUseCaseStub {
    async execute() {
      return faker.number.int()
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
    const sut = new GetUserBalanceController(getUserBalanceUseCase)

    return { getUserBalanceUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('Should return 200 when getting user balance', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const httpResponse = await sut.execute(httpRequest)

    //assert
    expect(httpResponse.statusCode).toBe(200)
  })

  it('Should return 400 if id is not valid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute({ params: { userId: 'id_invalid' } })

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 404 if id user is not found', async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut()
    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId))

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(404)
  })

  it('Should return 500 if getUserBalance thorws', async () => {
    //arrange
    const { sut, getUserBalanceUseCase } = makeSut()
    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(500)
  })
})
