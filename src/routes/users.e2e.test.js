import supertest from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

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
})
