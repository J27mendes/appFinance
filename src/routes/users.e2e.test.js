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
})
