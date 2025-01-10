import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './updateUser'
import { EmailExistsError } from '../../errors/user'

describe('UpdateUserUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class PostgresCompareEmailStub {
    async execute() {
      return null
    }
  }

  class PasswordHasherAdapter {
    async execute() {
      return 'hasher_password'
    }
  }

  class PostgresUpdateUserRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const postgresCompareEmail = new PostgresCompareEmailStub()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const postgresUpdateUserRepository = new PostgresUpdateUserRepositoryStub()
    const sut = new UpdateUserUseCase(
      postgresCompareEmail,
      postgresUpdateUserRepository,
      passwordHasherAdapter,
    )

    return {
      sut,
      postgresCompareEmail,
      postgresUpdateUserRepository,
      passwordHasherAdapter,
    }
  }

  it('should sucessfully update a user (without email and password) ', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    })

    //assert
    expect(result).toBe(user)
  })

  it('should update user successfully with email', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    })

    //assert
    expect(result).toBe(user)
  })

  it('must update the user successfully with email received by updateUserParams.email', async () => {
    //arrange
    const { sut, postgresCompareEmail } = makeSut()
    const postgresCompareEmailSpy = jest.spyOn(postgresCompareEmail, 'execute')
    const email = faker.internet.email()

    //act
    const result = await sut.execute(faker.string.uuid(), { email })

    //assert
    expect(postgresCompareEmailSpy).toHaveBeenCalledWith(email)
    expect(result).toBe(user)
  })

  it('should update user successfully with password', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid(), {
      password: faker.internet.password({ length: 7 }),
    })

    //assert
    expect(result).toBe(user)
  })

  it('must update the user successfully with email received by updateUserParams.password', async () => {
    //arrange
    const { sut, passwordHasherAdapter } = makeSut()
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapter,
      'execute',
    )
    const password = faker.internet.password()

    //act
    const result = await sut.execute(faker.string.uuid(), { password })

    //assert
    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
    expect(result).toBe(user)
  })

  it('should throws EmailAlreadyInUseError if email already in use', async () => {
    //arrange
    const { sut, postgresCompareEmail } = makeSut()
    jest.spyOn(postgresCompareEmail, 'execute').mockResolvedValue(user)

    //act
    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    })

    //assert
    await expect(promise).rejects.toThrow(new EmailExistsError(user.email))
  })
})
