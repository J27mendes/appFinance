import supertest from 'supertest';
import { user, transaction } from '../tests/fixtures/index.js';
import { app } from '../app.js';
import { TransactionType } from '@prisma/client';

describe('Transaction Routes E2E Tests', () => {
  const request = supertest;

  it('POST /api/transactions should return 201 when creating a transaction succefully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    expect(response.status).toBe(201);
    expect(response.body.user_id).toBe(createdUser.id);
    expect(response.body.type).toBe(transaction.type);
    expect(response.body.amount).toBe(String(transaction.amount));
  });

  it('GET /api/transaction?userId should return 200 when fetching transaction successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const response = await request(app)
      .get(`/api/transactions`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(createdTransaction.id);
  });

  it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const response = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ amount: 100, type: TransactionType.INVESTMENT });

    expect(response.status).toBe(200);
    expect(response.body.amount).toBe('100');
    expect(response.body.type).toBe(TransactionType.INVESTMENT);
  });

  it('DELETE /api/trancations/:transactionId should return 200 when deleting a transaction successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const response = await request(app)
      .delete(`/api/transactions/${createdTransaction.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
  });

  it('PATCH /api/transaction/:transactionId should return 404 when updating a non existing transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const response = await request(app)
      .patch(`/api/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ amount: 100, type: TransactionType.INVESTMENT });
    expect(response.status).toBe(404);
  });

  it('DELETE /api/transaction/:transactionId should return 404 when deleting a non existing transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const response = await request(app)
      .delete(`/api/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);
    expect(response.status).toBe(404);
  });
});
