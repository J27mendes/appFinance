import { ZodError } from 'zod';
import { UserNotFoundError } from '../../errors/index.js';
import { getTransactionByUserIdSchema } from '../../schemas/index.js';
import {
  badRequest,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js';

export class GetTransactionByUserIdController {
  constructor(getTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId;
      const from = httpRequest.query.from;
      const to = httpRequest.query.to;

      await getTransactionByUserIdSchema.parseAsync({
        user_id: userId,
        from,
        to,
      });

      const transactions =
        await this.getTransactionByUserIdUseCase.execute(userId);

      return ok(transactions);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(
        'Unexpected error in GetTransactionByUserIdController:',
        error,
      );

      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        });
      }
      return serverError();
    }
  }
}
