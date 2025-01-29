import { EmailExistsError } from '../../errors/user.js'
import { UserNotFoundError } from '../../errors/userNotFoundError.js'
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

  it('should call updateUserUseCase with correct params', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()
    const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

    //act
    await sut.execute(httpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    )
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

  it('should return 400 when an unllowed field is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed_value',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(500)
  })

  it('should return 400 if UpdateUserUseCase throws EmailExistsError', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new EmailExistsError(faker.internet.email())
    })

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 404 if UpdateUserUseCase throws UserNotFoundError', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()
    jest
      .spyOn(updateUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(faker.string.uuid()))

    //act
    const response = await sut.execute(httpRequest)

    //assert
    expect(response.statusCode).toBe(404)
  })

  it('should return 400 with error message when EmailExistsError is thrown', async () => {
    const { sut, updateUserUseCase } = makeSut()
    const email = faker.internet.email()

    jest.spyOn(updateUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new EmailExistsError(email)
    })

    const response = await sut.execute(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe(`The email: ${email} is already in use.`) // Verifique a mensagem aqui
  })
})
