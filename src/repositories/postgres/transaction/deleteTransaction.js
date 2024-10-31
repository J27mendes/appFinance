/* eslint-disable no-unused-vars */
import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteTransactionRepository {
  async execute(transactionId) {
    try {
      await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      })
    } catch (error) {
      return null
    }
  }
}
