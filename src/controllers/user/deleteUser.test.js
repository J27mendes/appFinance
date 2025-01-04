import { faker } from '@faker-js/faker'
import { DeleteUserController } from './deleteUserById'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('DeleteUserController', () => {
  class deleteUserUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      }
    }
  }

  const makeSut = () => {
    const deleteUserUseCase = new deleteUserUseCaseStub()
    const sut = new DeleteUserController(deleteUserUseCase)

    return { deleteUserUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('Should return 200 if user is deleted', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(200)
  })

  it('Should call deleteUserUseCase with correct params', async () => {
    //arrange
    const { sut, deleteUserUseCase } = makeSut()
    const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

    //act
    await sut.execute(httpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })

  it('Should return 400 if id is not valid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } })

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when id is not found', async () => {
    //arrange
    const { sut, deleteUserUseCase } = makeSut()
    jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValueOnce(null)

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({ message: 'User not found' })
  })

  it('Should return 404 id user is not found', async () => {
    //arrange
    const { sut, deleteUserUseCase } = makeSut()
    jest
      .spyOn(deleteUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId))

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(404)
  })

  it('Shuld return 500 if DeleteUserUseCase an throws', async () => {
    //arrange
    const { sut, deleteUserUseCase } = makeSut()
    jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(500)
  })
})
