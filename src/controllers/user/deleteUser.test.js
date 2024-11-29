import { faker } from '@faker-js/faker'

describe('DeleteUserController', () => {
  class DeleteUseCaseStub {
    execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.last_name(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      }
    }
  }

  const makeSut = () => {
    const deleteUserUseCase = new DeleteUseCaseStub()
    const sut = new DeleteUserController(deleteUserUseCase)

    return { deleteUserUseCase, sut }
  }
  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 if user is deleted', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(httpRequest)

    // assert
    expect(result.statusCode).toBe(200)
  })

  it('should return 400 if id is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute({ params: { userId: 'inavalid_id' } })

    //set
    expect(result.statusCode).toBe(400)
  })
})
