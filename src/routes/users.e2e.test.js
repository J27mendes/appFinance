import supertest from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/index.js'

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
})
