import { prisma } from '../../../../prisma/prisma.js';
export class PostgresGetTransactionsByIdRepository {
  async execute(userId, from, to) {
    return await prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
    });
  }
}
