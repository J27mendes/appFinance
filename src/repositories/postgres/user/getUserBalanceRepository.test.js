import { faker } from '@faker-js/faker'
import { prisma, TransactionType } from '../../../../prisma/prisma'
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
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 8200,
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1000,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1500,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 2300,
          type: 'INVESTMENT',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 3300,
          type: 'INVESTMENT',
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
})
