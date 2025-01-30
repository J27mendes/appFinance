/* eslint-disable no-unused-vars */
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transactionNotFoundError.js'
export class PostgresDeleteTransactionRepository {
  async execute(transactionId) {
    try {
      return await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      })
    } catch (error) {
      //"An operation failed because it depends on one or more records that were required but not found. {cause}"
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new TransactionNotFoundError(transactionId)
        }
      }
      throw error
    }
  }
}
