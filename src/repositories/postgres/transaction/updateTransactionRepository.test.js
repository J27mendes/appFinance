import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/fixtures'
import { PostgresUpdateTransactionRepository } from './updateTransactionRepository'
import { TransactionType } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transactionNotFoundError'

dayjs.extend(utc)

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
        expect(dayjs(result.date).utc().daysInMonth()).toBe(
            dayjs(params.date).utc().daysInMonth(),
        )
        expect(dayjs(result.date).utc().month()).toBe(
            dayjs(params.date).utc().month(),
        )
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
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        // Act & Assert
        await expect(sut.execute(transaction.id, transaction)).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma does not find record to update', async () => {
        //arrange
        // await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        //act
        const promise = sut.execute(transaction.id, transaction)

        //assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })

    it('should throw an error in the PostgresUpdateTransactionRepository if an unexpected error occurs', async () => {
        //arrange
        const error = new Error()
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValue(error)

        //axt & assert
        await expect(sut.execute('invalid-id')).rejects.toThrow(error)
    })
})
