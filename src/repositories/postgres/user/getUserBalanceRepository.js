import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const balance = await PostgresHelper.query(
      `SELECT
                SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS EARNINGS,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS EXPENSES,
                SUM(CASE WHEN type = 'INVESTIMENT' THEN amount ELSE 0 END) AS INVESTMENTS,
                (
                    SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
                   - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) 
                   - SUM(CASE WHEN type = 'INVESTIMENT' THEN amount ELSE 0 END)
                ) AS balance
                 FROM transactions
                 WHERE user_id = $1;`,
      [userId],
    )
    return balance[0]
  }
}
