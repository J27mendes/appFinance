import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { TransactionType } from '@prisma/client';
import { user as fakeUser } from '../../../tests/fixtures/index.js';
import { PostgresGetUserBalanceRepository } from './getUserBalanceRepository.js';

describe('PostgresGetUserBalanceRepository', () => {
  const from = '2024-01-01';
  const to = '2024-01-22';

  it('should get user balance on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 8500,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 8200,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(to),
          amount: 1000,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(to),
          amount: 1500,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 2300,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: new Date(from),
          amount: 3300,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    //act
    const result = await sut.execute(user.id, from, to);

    //assert
    expect(result.earnings.toString()).toBe('16700');
    expect(result.expenses.toString()).toBe('2500');
    expect(result.investments.toString()).toBe('5600');
    expect(result.balance.toString()).toBe('8600');
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository();
    const primsaSpy = import.meta.jest.spyOn(prisma.transaction, 'aggregate');

    //act
    await sut.execute(fakeUser.id, from, to);

    //assert
    expect(primsaSpy).toHaveBeenCalledTimes(3);
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
  });

  it('should throw if Prisma throw', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository();
    import.meta.jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(fakeUser.id, from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should return zero balance if user has no transactions', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserBalanceRepository();

    // Act
    const result = await sut.execute(user.id, from, to);

    // Assert
    expect(result.earnings.toString()).toBe('0');
    expect(result.expenses.toString()).toBe('0');
    expect(result.investments.toString()).toBe('0');
    expect(result.balance.toString()).toBe('0');
  });

  it('should use Prisma.Decimal(0) when aggregate returns null for earnings, expenses or investments', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser });
    import.meta.jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockResolvedValueOnce({
        _sum: { amount: null },
      })
      .mockResolvedValueOnce({
        _sum: { amount: null },
      })
      .mockResolvedValueOnce({
        _sum: { amount: null },
      });

    const sut = new PostgresGetUserBalanceRepository();

    // Act
    const result = await sut.execute(user.id);

    // Assert
    expect(result.earnings.toString()).toBe('0');
    expect(result.expenses.toString()).toBe('0');
    expect(result.investments.toString()).toBe('0');
    expect(result.balance.toString()).toBe('0');
  });
});
