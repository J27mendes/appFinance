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
        first_name: 'fernanda',
        last_name: 'bicalho',
        email: 'bicalho@gmail.com',
        password: 'criptografado',
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(201)
    expect(result.body).not.toBeUndefined()
    expect(result.body).not.toBeNull()
  })

  it('Should return 400 if first_name is not providesd', async () => {
    //arrange
    const createUserUseCase = new CreateUserControllerStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        last_name: 'bicalho',
        email: 'bicalho@gmail.com',
        password: 'criptografado',
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
        first_name: 'Jeniffer',
        email: 'bicalho@gmail.com',
        password: 'criptografado',
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
        first_name: 'luanna',
        last_name: 'bicalho',
        password: 'criptografado',
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
        first_name: 'luanna',
        last_name: 'bicalho',
        email: 'bi',
        password: 'criptografado',
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
        first_name: 'Gabriela',
        last_name: 'bicalho',
        email: 'bicalho@gmail.com',
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
        first_name: 'Gabriela',
        last_name: 'bicalho',
        email: 'bicalho@gmail.com',
        password: '11',
      },
    }

    //act
    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })
})
