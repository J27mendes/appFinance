import { faker } from '@faker-js/faker';
import { CreateUserController } from './userCreate.js';
import { EmailExistsError } from '../../errors/index.js';
import { ZodError } from 'zod';

describe('Create User Controller', () => {
  class CreateUserControllerStub {
    async execute(user) {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserControllerStub();
    const sut = new CreateUserController(createUserUseCase);

    return { createUserUseCase, sut };
  };

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  };

  it('Should create a user successfully with valid data', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
    expect(result.body).not.toBeUndefined();
    expect(result.body).not.toBeNull();
  });

  it('Should return 400 if first_name is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest, first_name: undefined },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 400 if last_name is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest, last_name: undefined },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 400 if email is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest, email: undefined },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 400 if email is not valid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest, email: 'invalid_email' },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 400 if password is not provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: { ...httpRequest, password: undefined },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('Should return 400 if password is less than 6 characters', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest,
        password: faker.internet.password({ length: 5 }),
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should call CreateUserUseCase with correct params', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(createUserUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if CreateUserUseCase throws', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(createUserUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(createUserUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new EmailExistsError(httpRequest.body.email);
      });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is invalid according to Zod validation', async () => {
    const { sut } = makeSut();

    // Email com formato inválido
    const invalidEmailRequest = {
      body: { ...httpRequest.body, email: 'invalid_email' },
    };

    const result = await sut.execute(invalidEmailRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Please provide a valid e-mail');
  });

  it('should return 400 if email is invalid according to Zod validation', async () => {
    //arrange
    const { sut, createUserUseCase } = makeSut();
    const zodError = new ZodError([
      {
        message: 'Please provide a valid e-mail',
        path: ['email'],
        validation: 'email',
      },
    ]);

    import.meta.jest
      .spyOn(createUserUseCase, 'execute')
      .mockRejectedValueOnce(zodError);

    //act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Please provide a valid e-mail');
  });
});
