import { faker } from '@faker-js/faker'
import { DeleteUserController } from './deleteUserById'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'

describe('DeleteUserController', () => {
  class deleteUserUseCaseStub {
    execute() {
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

  it('Should return 400 if id is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } })

    //assert
    expect(result.statusCode).toBe(400)
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

  it('Shuld return 500 if DeleteUserUseCase', async () => {
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
