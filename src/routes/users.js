import { Router } from 'express';
import {
  makeDeleteUserById,
  makeGetUserBalanceController,
  makeGetUserById,
  makePostUser,
  makeUpdateUserById,
} from '../factores/controllers/index.js';

export const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const createUserController = makePostUser();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.get('/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserById();

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.get('/:userId/balance', async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();

  const { statusCode, body } = await getUserBalanceController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.patch('/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserById();

  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.delete('/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserById();

  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).send(body);
});
