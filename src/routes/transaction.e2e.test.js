import supertest from 'supertest'
import { user, transaction } from '../tests/fixtures/index.js'
import { app } from '../app.js'
describe('Transaction Routes E2E Tests', () => {
  const request = supertest

  it('POST /api/transactions should return 201 when creating a transaction succefully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      })

    const response = await request(app)
      .post('/api/transactions')
      .send({ ...transaction, user_id: createdUser.id, id: undefined })

    expect(response.status).toBe(201)
    expect(response.body.user_id).toBe(createdUser.id)
    expect(response.body.type).toBe(transaction.type)
    expect(response.body.amount).toBe(String(transaction.amount))
  })
})
