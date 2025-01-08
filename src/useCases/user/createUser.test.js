import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './createUser.js'
import { EmailExistsError } from '../../errors/user.js'

describe('Create User Use Case', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null
    }
  }

  class CreateUserRepositoryStub {
    async execute(user) {
      return user
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'hashed_password'
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'generator_id'
    }
  }

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    )

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    }
  }

  it('should sucessfully create a user', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const createdUser = await sut.execute(user)

    //assert
    expect(createdUser).toBeTruthy()
  })

  it('should throw an EmailExistsError if GetUserByEmailRepository returns a user', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut()
    jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(user)

    //act
    const promise = sut.execute(user)

    //assert
    await expect(promise).rejects.toThrow(new EmailExistsError(user.email))
  })

  it('should call IdGeneratorAdapter generate a random id', async () => {
    //arraange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
    const idGeneratorSpy = jest
      .spyOn(idGeneratorAdapter, 'execute')
      .mockReturnValue('generated_id')
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

    //act
    await sut.execute(user)

    //assert
    expect(idGeneratorSpy).toHaveBeenCalled()
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    })
  })
})
