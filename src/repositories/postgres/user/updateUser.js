import { prisma } from '../../../../prisma/prisma'
export class PostgresUpdateUserRepository {
  async execute(userId, updateUserParams) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserParams,
    })
  }
}
