import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/userNotFoundError.js'
export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        try {
            return await prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateUserParams,
            })
        } catch (error) {
            // return null
            //"An operation failed because it depends on one or more records that were required but not found. {cause}"
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }
            throw error
        }
    }
}
