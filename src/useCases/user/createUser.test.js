import { CreateUserUseCase } from './createUser.js';
import { EmailExistsError } from '../../errors/index.js';
import { user } from '../../tests/fixtures/index.js';

describe('CreateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'hashed_password';
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'generator_id';
    }
  }

  class TokensGeneratorAdapterStub {
    execute() {
      return {
        accessToken: 'any_access_token',
        refreshToken: 'any_access_token',
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const tokenGeneretorAdapter = new TokensGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
      tokenGeneretorAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
      tokenGeneretorAdapter,
    };
  };

  it('should sucessfully create a user', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const createdUser = await sut.execute(user);

    //assert
    expect(createdUser).toBeTruthy();
    expect(createdUser.tokens.accessToken).toBeDefined();
    expect(createdUser.tokens.refreshToken).toBeDefined();
  });

  it('should throw an EmailExistsError if GetUserByEmailRepository returns a user', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockReturnValueOnce(user);

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow(new EmailExistsError(user.email));
  });

  it('should call IdGeneratorAdapter generate a random id', async () => {
    //arraange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = import.meta.jest
      .spyOn(idGeneratorAdapter, 'execute')
      .mockReturnValue('generated_id');
    const createUserRepositorySpy = import.meta.jest.spyOn(
      createUserRepository,
      'execute',
    );

    //act
    await sut.execute(user);

    //assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  it('should call PasswordHasherAdapter to cryptograph password', async () => {
    //arrange
    const { sut, passwordHasherAdapter, createUserRepository } = makeSut();
    const passwordHasherSpy = import.meta.jest.spyOn(
      passwordHasherAdapter,
      'execute',
    );
    const createUserRepositorySpy = import.meta.jest.spyOn(
      createUserRepository,
      'execute',
    );

    //act
    await sut.execute(user);

    //assert
    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generator_id',
    });
  });

  it('should throw if GetUserByEmailRepository throws', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGenerator throws', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut();
    import.meta.jest
      .spyOn(idGeneratorAdapter, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
