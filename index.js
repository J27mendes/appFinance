import { PostgresHelper } from './src/db/postgres/helper.js'
import express from 'express'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.get('/', async (req, res) => {
  try {
    const results = await PostgresHelper.query('SELECT * FROM users;')
    res.json(results.rows)
  } catch (err) {
    console.error('erro ao executar consulta:', err)
    res.status(500).json({ error: 'erro ao buscar dados no banco de dados' })
  }
})

app.listen(3000, () => console.log('listening on port 3000'))
