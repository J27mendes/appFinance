import express from 'express'
import 'dotenv/config.js'
import { CreateUserController } from './src/controllers/userCreate.js'
import { GetUserByIdController } from './src/controllers/getUserById.js'
import { UpdateUserControler } from './src/controllers/updateUserId.js/index.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
  const createUserController = new CreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdController = new GetUserByIdController()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserControler = new UpdateUserControler()
  const { statusCode, body } = await updateUserControler.execute(request)
  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)
