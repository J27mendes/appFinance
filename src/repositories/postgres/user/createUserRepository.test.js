import { PostgresCreateUserRepository } from './createUser';
import { user } from '../../../tests/fixtures/index';
import { prisma } from '../../../../prisma/prisma';

describe('CreateUserRepository', () => {
  it('should create a user on db', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();

    //act
    const result = await sut.execute(user);

    //assert
    expect(result.id).toBe(user.id);
    expect(result.first_name).toBe(user.first_name);
    expect(result.last_name).toBe(user.last_name);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'create');

    //act
    await sut.execute(user);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({ data: user });
  });

  it('should throws if Prisma throws', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'create')
      .mockRejectedValueOnce(new Error());

    //act
    const result = sut.execute(user);

    //assert
    expect(result).rejects.toThrow();
  });
});
