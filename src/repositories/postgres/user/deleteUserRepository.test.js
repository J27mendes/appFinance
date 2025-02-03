import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../../prisma/prisma';
import { UserNotFoundError } from '../../../errors/userNotFoundError.js';
import { user } from '../../../tests/fixtures/index.js';
import { PostgresDeleteUserRepository } from './deleteUser';

describe('PostgresDeleteUserRepository', () => {
  it('should delete a user on db', async () => {
    //arrange
    await prisma.user.create({
      data: user,
    });
    const sut = new PostgresDeleteUserRepository();

    //act
    const result = await sut.execute(user.id);

    //assert
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'delete');
    const sut = new PostgresDeleteUserRepository();

    //act
    await sut.execute(user.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });

  it('should throw generic error if Prisma throws generic error', async () => {
    //arrange
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'delete')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user.id);

    //
    await expect(promise).rejects.toThrow();
  });

  it('should throw PrismaClientKnowRequestError throw UserNotFoundError', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });
});
