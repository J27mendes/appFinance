import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma.js'
import { transaction, user } from '../../../tests/fixtures/index.js'
import { PostgresCreateTransactionRepository } from './createTransaction.js'

describe('PostgresCreateTransactionReposioty', () => {
  it('should create a transaction on db', async () => {
    //arrange
    await prisma.user.create({
      data: user,
    })
    const sut = new PostgresCreateTransactionRepository()

    //act
    const result = await sut.execute({ ...transaction, user_id: user.id })

    //assert
    expect(result.name).toBe(transaction.name)
    expect(result.type).toBe(transaction.type)
    expect(result.user_id).toBe(user.id)
    expect(String(result.amount)).toBe(String(transaction.amount))
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    )
    expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
  })

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user })
    const sut = new PostgresCreateTransactionRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'create')

    //act
    await sut.execute({ ...transaction, user_id: user.id })

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...transaction,
        user_id: user.id,
      },
    })
  })

  it('should in PostgresCreateTransactionRepository throw if Prisma throw', async () => {
    //arrange
    const sut = new PostgresCreateTransactionRepository()
    jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(new Error())

    // Act & Assert
    await expect(sut.execute(transaction)).rejects.toThrow()
  })
})
