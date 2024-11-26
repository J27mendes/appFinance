import { faker } from '@faker-js/faker'
import { CreateUserController } from './userCreate.js'

describe('Create User Controller', () => {
  class CreateUserControllerStub {
    execute(user) {
      return user
    }
  }

  it('Should create a user successfully with valid data', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(httpRequest.body)
    expect(result.body).not.toBeUndefined()
    expect(result.body).not.toBeNull()
  })

  it('Should return 400 if first_name is not providesd', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 400 if last_name is not providesd', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 400 if email is not providesd', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 400 if email is not valid', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'invalid_email',
        password: faker.internet.password({ length: 7 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 400 if password is not providesd', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('Should return 400 if password is less than 6 characters', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 5 }),
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should call CreateUserUseCase with correct params', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }
    const executeSpy = jest.spyOn(createUserUseCase, 'execute')

    //act
    await createUserController.execute(httpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
