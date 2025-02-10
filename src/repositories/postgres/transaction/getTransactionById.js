import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetTransactionById {
  async execute(transactionId) {
    return await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
  }
}
