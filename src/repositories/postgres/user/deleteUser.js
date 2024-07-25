import { PostgresHelper } from '../../../db/postgres/helper.js'
import { UserNotFoundError } from '../../../errors/userNotFoundError.js'

export class PostgresDeleteUserRepository {
  async execute(userId) {
    try {
      const result = await PostgresHelper.query(
        'SELECT COUNT(*) AS count FROM users WHERE id = $1',
        [userId],
      )
      const count = parseInt(result[0].count)

      if (count === 0) {
        throw new UserNotFoundError(userId)
      } else {
        const deleteUser = await PostgresHelper.query(
          'DELETE FROM users WHERE id = $1 RETURNING *',
          [userId],
        )
        return deleteUser[0]
      }
    } catch (error) {
      console.error('Error executing delete query:', error)
      throw error
    }
  }
}
