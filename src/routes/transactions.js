import { Router } from 'express';
import {
  makeGetTransactionByUserIdController,
  makeCreateTransactionController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from '../factores/controllers/index.js';
import { auth } from '../middlewares/auth.js';

export const transactionsRouter = Router();

transactionsRouter.get('/', auth, async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } = await getTransactionsByUserIdController.execute({
    ...request,
    query: {
      ...request.query,
      userId: request.userId,
      from: request.query.from,
      to: request.query.to,
    },
  });

  response.status(statusCode).send(body);
});

transactionsRouter.post('/', auth, async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { statusCode, body } = await createTransactionController.execute({
    ...request,
    body: {
      ...request.body,
      user_id: request.userId,
    },
  });
  response.status(statusCode).send(body);
});

transactionsRouter.patch('/:transactionId', auth, async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();

  const { statusCode, body } = await updateTransactionController.execute({
    ...request,
    body: {
      ...request.body,
      user_id: request.userId,
    },
  });

  response.status(statusCode).send(body);
});

transactionsRouter.delete(
  '/:transactionId',
  auth,
  async (request, response) => {
    const deleteTransactionById = makeDeleteTransactionController();

    const { statusCode, body } = await deleteTransactionById.execute({
      ...request,
      body: {
        ...request.body,
        user_id: request.userId,
      },
    });

    response.status(statusCode).send(body);
  },
);
