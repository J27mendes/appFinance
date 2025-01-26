import supertest from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

const request = supertest

describe('User Routers E2E tests', () => {
  it('POST /users should return 201 user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      })

    expect(response.status).toBe(201)
  })

  it('GET /users/:userId should return 200 when user is found', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      })

    const response = await request(app).get(`/api/users/${createdUser.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(createdUser)
  })

  it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      })

    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const response = await request(app)
      .patch(`/api/users/${createdUser.id}`)
      .send(updateUserParams)

    expect(response.status).toBe(200)
    expect(response.body.first_name).toBe(updateUserParams.first_name)
    expect(response.body.last_name).toBe(updateUserParams.last_name)
    expect(response.body.email).toBe(updateUserParams.email)
    expect(response.body.password).not.toBe(updateUserParams.password)
  })

  it('DELETE /api/users/:userId should return 200 when user is deleted', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined })

    const response = await request(app).delete(`/api/users/${createdUser.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'User deleted successfully',
      transaction: createdUser,
    })
  })

  it('GET /api/users/:userId/balance should returns 200 and correct balance', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined })

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EARNING,
      amount: 10000,
    })

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EXPENSE,
      amount: 2000,
    })

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.INVESTMENT,
      amount: 1000,
    })

    const response = await request(app).get(
      `/api/users/${createdUser.id}/balance`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      earnings: '10000',
      expenses: '2000',
      investments: '1000',
      balance: '7000',
    })
  })

  it('Get /api/users/:userId should return 404 when user is not found', async () => {
    const response = await request(app).get(`/api/users/${faker.string.uuid()}`)

    expect(response.status).toBe(404)
  })
})
