import dayjs from 'dayjs'
import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/fixtures'
import { PostgresUpdateTransactionRepository } from './updateTransactionRepository'
import { TransactionType } from '@prisma/client'

describe('PostgresUpdateTransactionRepository', () => {
  it('should update transaction on db', async () => {
    //arrange
    await prisma.user.create({ data: user })
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    })
    const sut = new PostgresUpdateTransactionRepository()
    const params = {
      id: faker.string.uuid(),
      user_id: user.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EXPENSE,
      amount: Number(faker.finance.amount()),
    }

    //act
    const result = await sut.execute(transaction.id, params)

    //assert
    expect(result.name).toBe(params.name)
    expect(result.type).toBe(params.type)
    expect(result.user_id).toBe(user.id)
    expect(String(result.amount)).toBe(String(params.amount))
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(params.date).daysInMonth(),
    )
    expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
    expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
  })

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user })
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    })
    const sut = new PostgresUpdateTransactionRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'update')

    //act
    await sut.execute(transaction.id, { ...transaction, user_id: user.id })

    //assert
    expect(prismaSpy).toHaveBeenLastCalledWith({
      where: {
        id: transaction.id,
      },
      data: { ...transaction, user_id: user.id },
    })
  })

  it('should throw if Prisma throw', async () => {
    //arrange
    const sut = new PostgresUpdateTransactionRepository()
    jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(new Error())

    // Act & Assert
    await expect(sut.execute(transaction.id, transaction)).rejects.toThrow()
  })
})
