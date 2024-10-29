/* eslint-disable no-unused-vars */
import { prisma } from '../../../../prisma/prisma'
export class PostgresDeleteUserRepository {
  async execute(userId) {
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
      })
    } catch (error) {
      return null
    }
  }
}
