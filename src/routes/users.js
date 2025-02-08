import { Router } from 'express';
import {
  makeDeleteUserById,
  makeGetUserBalanceController,
  makeGetUserById,
  makeLoginUserController,
  makePostUser,
  makeUpdateUserById,
} from '../factores/controllers/index.js';
import { auth } from '../middlewares/auth.js';

export const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const createUserController = makePostUser();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.get('/:userId', auth, async (request, response) => {
  const getUserByIdController = makeGetUserById();

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.get('/:userId/balance', auth, async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();

  const { statusCode, body } = await getUserBalanceController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.patch('/:userId', auth, async (request, response) => {
  const updateUserController = makeUpdateUserById();

  const { statusCode, body } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.delete('/:userId', auth, async (request, response) => {
  const deleteUserController = makeDeleteUserById();

  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.post('/login', async (request, response) => {
  const loginUserController = makeLoginUserController();

  const { statusCode, body } = await loginUserController.execute(request);

  response.status(statusCode).send(body);
});
