import { UpdateUserController } from '../user/updateUserId.js'
import { faker } from '@faker-js/faker'

describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub()
    const sut = new UpdateUserController(updateUserUseCase)

    return { sut, updateUserUseCase }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  }

  it('should return 200 when updating a user sucessfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(httpRequest)

    //assert
    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when an invalid email', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: 'invalid_email',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when an invalid password', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 5 }),
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when an id invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
      body: {
        ...httpRequest.body,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })
})
