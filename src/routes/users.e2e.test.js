import supertest from 'supertest';
import { app } from '../app.js';
import { user } from '../tests/fixtures/index.js';
import { faker } from '@faker-js/faker';
import { TransactionType } from '@prisma/client';

const request = supertest;

describe('User Routers E2E tests', () => {
  const from = '2024-01-02';
  const to = '2024-01-22';

  it('POST /users should return 201 user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    expect(response.status).toBe(201);
  });

  it('GET /api/users/me should return 200 if user is authenticated and has been found', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .get(`/api/users/me`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });

  it('PATCH /api/users/me should return 200 if user is authenticated and has been updated', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .patch(`/api/users/me`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send(updateUserParams);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(updateUserParams.first_name);
    expect(response.body.last_name).toBe(updateUserParams.last_name);
    expect(response.body.email).toBe(updateUserParams.email);
    expect(response.body.password).not.toBe(updateUserParams.password);
  });

  it('DELETE /api/users/me should return 200 if user is authenticated and has been deleted', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const response = await request(app)
      .delete(`/api/users/me`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedUser.id).toBe(createdUser.id);
  });

  it('GET /api/users/me/balance should return 200 and the user is authenticated and the balance is correct', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(to),
        type: TransactionType.EARNING,
        amount: 10000,
      });

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(from),
        type: TransactionType.EXPENSE,
        amount: 2000,
      });

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(from),
        type: TransactionType.INVESTMENT,
        amount: 1000,
      });

    const response = await request(app)
      .get(`/api/users/me/balance?from=${from}&to=${to}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      earnings: '10000',
      expenses: '2000',
      investments: '1000',
      earningsPercentage: '76',
      expensesPercentage: '15',
      investmentsPercentage: '7',
      balance: '7000',
    });
  });

  it('POST /api/users should return 400 when the proided e-mail is already in use', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined, email: createdUser.email });

    expect(response.status).toBe(400);
  });

  it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const response = await request(app).post('/api/users/login').send({
      email: createdUser.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();
  });

  it('POST /api/users/refreshtoken should return 200 and new tokens when refresh token is valid', async () => {
    //arrange
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    //act
    const response = await request(app).post('/api/users/refreshtoken').send({
      refreshToken: createdUser.tokens.refreshToken,
    });

    //assert
    expect(createdUser.tokens.refreshToken).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });
});
