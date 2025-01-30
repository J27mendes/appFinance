import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { TransactionType } from '@prisma/client'
import { user as fakeUser } from '../../../tests/fixtures/index.js'
import { PostgresGetUserBalanceRepository } from './getUserBalanceRepository.js'

describe('PostgresGetUserBalanceRepository', () => {
  it('should get user balance on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser })

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 8500,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 8200,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1000,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1500,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 2300,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 3300,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
      ],
    })

    const sut = new PostgresGetUserBalanceRepository()

    //act
    const result = await sut.execute(user.id)

    //assert
    expect(result.earnings.toString()).toBe('16700')
    expect(result.expenses.toString()).toBe('2500')
    expect(result.investments.toString()).toBe('5600')
    expect(result.balance.toString()).toBe('8600')
  })

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository()
    const primsaSpy = jest.spyOn(prisma.transaction, 'aggregate')

    //act
    await sut.execute(fakeUser.id)

    //assert
    expect(primsaSpy).toHaveBeenCalledTimes(3)
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    })
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    })
  })

  it('should throw if Prisma throw', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository()
    jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error())

    //act
    const promise = sut.execute(fakeUser.id)

    //assert
    await expect(promise).rejects.toThrow()
  })

  it('should return zero balance if user has no transactions', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresGetUserBalanceRepository()

    // Act
    const result = await sut.execute(user.id)

    // Assert
    expect(result.earnings.toString()).toBe('0')
    expect(result.expenses.toString()).toBe('0')
    expect(result.investments.toString()).toBe('0')
    expect(result.balance.toString()).toBe('0')
  })
})
