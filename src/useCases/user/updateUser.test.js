import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './updateUser';
import { EmailExistsError } from '../../errors/index';
import { user } from '../../tests/fixtures/index';

describe('UpdateUserUseCase', () => {
  class PostgresCompareEmailStub {
    async execute() {
      return null;
    }
  }

  class PasswordHasherAdapter {
    async execute() {
      return 'hashed_password';
    }
  }

  class PostgresUpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const postgresCompareEmail = new PostgresCompareEmailStub();
    const passwordHasherAdapter = new PasswordHasherAdapter();
    const postgresUpdateUserRepository = new PostgresUpdateUserRepositoryStub();
    const sut = new UpdateUserUseCase(
      postgresCompareEmail,
      postgresUpdateUserRepository,
      passwordHasherAdapter,
    );

    return {
      sut,
      postgresCompareEmail,
      postgresUpdateUserRepository,
      passwordHasherAdapter,
    };
  };

  it('should sucessfully update a user (without email and password) ', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(user.id, {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    });

    //assert
    expect(result).toBe(user);
  });

  it('should update user successfully with email', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(user.id, {
      email: user.email,
    });

    //assert
    expect(result).toBe(user);
  });

  it('must update the user successfully with email received by updateUserParams.email', async () => {
    //arrange
    const { sut, postgresCompareEmail } = makeSut();
    const postgresCompareEmailSpy = import.meta.jest.spyOn(
      postgresCompareEmail,
      'execute',
    );
    const email = user.email;

    //act
    const result = await sut.execute(user.id, { email });

    //assert
    expect(postgresCompareEmailSpy).toHaveBeenCalledWith(email);
    expect(result).toBe(user);
  });

  it('should update user successfully with password', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(user.id, {
      password: user.password,
    });

    //assert
    expect(result).toBe(user);
  });

  it('must update the user successfully with email received by updateUserParams.password', async () => {
    //arrange
    const { sut, passwordHasherAdapter } = makeSut();
    const passwordHasherAdapterSpy = import.meta.jest.spyOn(
      passwordHasherAdapter,
      'execute',
    );
    const password = user.password;

    //act
    const result = await sut.execute(user.id, { password });

    //assert
    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
    expect(result).toBe(user);
  });

  it('should throws EmailAlreadyInUseError if email already in use', async () => {
    //arrange
    const { sut, postgresCompareEmail } = makeSut();
    const existingUser = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
    };
    const differentUserId = faker.string.uuid();
    import.meta.jest
      .spyOn(postgresCompareEmail, 'execute')
      .mockResolvedValue(existingUser);

    //act
    const promise = sut.execute(differentUserId, {
      email: existingUser.email,
    });

    //assert
    await expect(promise).rejects.toThrow(
      new EmailExistsError(existingUser.email),
    );
  });

  it('should call UpdateUserRepository with correct params', async () => {
    //arrange
    const { sut, postgresUpdateUserRepository } = makeSut();
    const postgresUpdateUserRepositorySpy = import.meta.jest.spyOn(
      postgresUpdateUserRepository,
      'execute',
    );

    //act
    await sut.execute(user.id, {
      ...user,
      id: undefined,
    });

    //assert
    expect(postgresUpdateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
      ...user,
      id: undefined,
      password: 'hashed_password',
    });
  });

  it('should throw if postgresCompareEmail throws', async () => {
    //arrange
    const { sut, postgresCompareEmail } = makeSut();
    import.meta.jest
      .spyOn(postgresCompareEmail, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(user.id, {
      email: user.email,
    });

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if passwordHasherAdapter throws', async () => {
    //arrange
    const { sut, passwordHasherAdapter } = makeSut();
    import.meta.jest
      .spyOn(passwordHasherAdapter, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(user.id, {
      password: user.password,
    });

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if postgresUpdateUserRepository throws', async () => {
    //arrange
    const { sut, postgresUpdateUserRepository } = makeSut();
    import.meta.jest
      .spyOn(postgresUpdateUserRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const userMOck = {
      ...user,
      id: undefined,
    };
    const promise = sut.execute(faker.string.uuid(), { userMOck });

    //assert
    await expect(promise).rejects.toThrow();
  });
});
