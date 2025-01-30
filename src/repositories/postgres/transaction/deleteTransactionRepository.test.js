import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/fixtures'
import { PostgresDeleteTransactionRepository } from './deleteTransaction'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transactionNotFoundError'

dayjs.extend(utc)

describe('PostgresDeleteTransactionRepository', () => {
  it('should delete a transation on db', async () => {
    //arrange
    await prisma.user.create({ data: user })
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    })
    const sut = new PostgresDeleteTransactionRepository()

    //axt
    const result = await sut.execute(transaction.id)

    //assert
    expect(result.name).toBe(transaction.name)
    expect(result.type).toBe(transaction.type)
    expect(result.user_id).toBe(user.id)
    expect(String(result.amount)).toBe(String(transaction.amount))
    expect(dayjs(result.date).utc().daysInMonth()).toBe(
      dayjs(transaction.date).utc().daysInMonth(),
    )
    expect(dayjs(result.date).utc().month()).toBe(
      dayjs(transaction.date).utc().month(),
    )
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
  })

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user })
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    })
    const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
    const sut = new PostgresDeleteTransactionRepository()

    //act
    await sut.execute(transaction.id)

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    })
  })

  it('should throw generic error if Prisma throws generic error', async () => {
    //arrange
    const sut = new PostgresDeleteTransactionRepository()
    jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(new Error())

    //act
    const promise = sut.execute(transaction.id)

    //
    await expect(promise).rejects.toThrow()
  })

  it('should throw PrismaClientKnowRequestError throw TransactionNotFoundError', async () => {
    //arrange
    const sut = new PostgresDeleteTransactionRepository()
    jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
      }),
    )

    //act
    const promise = sut.execute(transaction.id)

    //assert
    expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transaction.id),
    )
  })

  it('should throw a generic error if Prisma throws a non-P2025 error', async () => {
    // Arrange
    const sut = new PostgresDeleteTransactionRepository()
    jest
      .spyOn(prisma.transaction, 'delete')
      .mockRejectedValueOnce(new Error('Unexpected error'))

    // Act & Assert
    try {
      await sut.execute('invalid-id')
    } catch (error) {
      expect(error.message).toBe('Unexpected error')
    }
  })
})
