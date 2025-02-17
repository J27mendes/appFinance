import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user } from '../../../tests/fixtures';
import { PostgresGetTransactionsByIdRepository } from './getTransactionByUserId';

describe('PostgresGetTransactionsByIdRepository', () => {
  const from = '2024-01-01';
  const to = '2024-02-01';

  it('should get transaction by user id on db', async () => {
    const date = '2024-01-03';
    //arrange
    const sut = new PostgresGetTransactionsByIdRepository();
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, date: new Date(date), user_id: user.id },
    });

    //act
    const result = await sut.execute(user.id, from, to);

    //assert
    expect(result.length).toBe(1);
    expect(result[0].name).toBe(transaction.name);
    expect(result[0].type).toBe(transaction.type);
    expect(result[0].user_id).toBe(user.id);
    expect(String(result[0].amount)).toBe(String(transaction.amount));
    expect(dayjs(result[0].date).daysInMonth()).toBe(dayjs(date).daysInMonth());
    expect(dayjs(result[0].date).month()).toBe(dayjs(date).month());
    expect(dayjs(result[0].date).year()).toBe(dayjs(date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetTransactionsByIdRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany');

    //act
    await sut.execute(user.id, from, to);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id,
        date: {
          gte: new Date('2024-01-01'), // Converte a string do teste para Date
          lte: new Date('2024-02-01'),
        },
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresGetTransactionsByIdRepository();
    import.meta.jest
      .spyOn(prisma.transaction, 'findMany')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
