import { prisma } from '../../../../prisma/prisma.js'
export class PostgresCompareEmail {
  async execute(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
