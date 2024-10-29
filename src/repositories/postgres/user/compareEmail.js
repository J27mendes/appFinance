import { prisma } from '../../../../prisma/prisma'
export class PostgresCompareEmail {
  async execute(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
