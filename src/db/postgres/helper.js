import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
})

export const PostgresHelper = {
  query: async (query, params) => {
    const client = await pool.connect()
    try {
      const results = await client.query(query, params)
      return results.rows
    } finally {
      client.release()
    }
  },
}
export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      //validar a requisição (campos obrigatiorios, tamanho de senha e e-mail}
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields)
        if (!params[field] || params[field].trim().length === 0) {
          return {
            statusCode: 400,
            body: {
              errorMessage: `Missing param: ${field}`,
            },
          }
        }
      //chamar o use case
      const CreateUserUseCase = new CreateUserUseCase()

      const createUser = await CreateUserUseCase.execute()

      return {
        //retornar a resposta para o usuario (status code)
        statusCode: 201,
        body: createUser,
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: {
          errorMessage: 'Internal server error',
        },
      }
    }
  }
}
