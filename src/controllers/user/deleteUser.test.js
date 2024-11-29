import { faker } from '@faker-js/faker'
import { DeleteUserController } from './deleteUserById'

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
})
