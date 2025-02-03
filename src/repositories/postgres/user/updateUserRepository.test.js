import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests/fixtures';
import { PostgresUpdateUserRepository } from './updateUser';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserNotFoundError } from '../../../errors/userNotFoundError';

describe('PostgresUpdateUserRepository', () => {
  const updateUserParams = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it('should update user on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();

    //act
    const result = await sut.execute(user.id, updateUserParams);

    //assert
    expect(result).toStrictEqual(updateUserParams);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update');

    //act
    await sut.execute(user.id, updateUserParams);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },
      data: updateUserParams,
    });
  });

  it('should throws if Prisma throw', async () => {
    //arrange
    const sut = new PostgresUpdateUserRepository();
    import.meta.jest
      .spyOn(prisma.user, 'findUnique')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(updateUserParams);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw UserNotFoundError if Prisma does not find record to update', async () => {
    //arrange
    // await prisma.user.create({ data: fakeUser })
    const sut = new PostgresUpdateUserRepository();
    import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    );

    //act
    const promise = sut.execute(updateUserParams.id);

    //assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(updateUserParams.id),
    );
  });
});
