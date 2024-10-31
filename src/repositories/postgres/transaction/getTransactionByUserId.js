import { prisma } from '../../../../prisma/prisma.js'
export class PostgresGetTransactionsByIdRepository {
  async execute(userId) {
    return await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
    })
  }
}
