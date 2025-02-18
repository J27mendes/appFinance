import { Router } from 'express';
import {
  makeDeleteUserById,
  makeGetUserBalanceController,
  makeGetUserById,
  makeLoginUserController,
  makePostUser,
  makeRefreshTokenController,
  makeUpdateUserById,
} from '../factores/controllers/index.js';
import { auth } from '../middlewares/auth.js';

export const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const createUserController = makePostUser();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.get('/me', auth, async (request, response) => {
  const getUserByIdController = makeGetUserById();

  const { statusCode, body } = await getUserByIdController.execute({
    ...request,
    params: {
      userId: request.userId,
    },
  });

  response.status(statusCode).send(body);
});

userRouter.get('/me/balance', auth, async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();

  const { statusCode, body } = await getUserBalanceController.execute({
    ...request,
    params: {
      userId: request.userId,
    },
    query: {
      from: request.query.from,
      to: request.query.to,
    },
  });

  response.status(statusCode).send(body);
});

userRouter.patch('/me', auth, async (request, response) => {
  const updateUserController = makeUpdateUserById();

  const { statusCode, body } = await updateUserController.execute({
    ...request,
    params: {
      userId: request.userId,
    },
  });
  response.status(statusCode).send(body);
});

userRouter.delete('/me', auth, async (request, response) => {
  const deleteUserController = makeDeleteUserById();

  const { statusCode, body } = await deleteUserController.execute({
    ...request,
    params: {
      userId: request.userId,
    },
  });

  response.status(statusCode).send(body);
});

userRouter.post('/auth', async (request, response) => {
  const loginUserController = makeLoginUserController();

  const { statusCode, body } = await loginUserController.execute(request);

  response.status(statusCode).send(body);
});

userRouter.post('/authtoken', async (request, response) => {
  const refreshTokenController = makeRefreshTokenController();

  const { statusCode, body } = await refreshTokenController.execute(request);

  response.status(statusCode).send(body);
});
