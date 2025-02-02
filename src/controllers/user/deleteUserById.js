import { UserNotFoundError } from '../../errors/userNotFoundError.js';
import {
  invalidIdResponse,
  userNotFoundResponse,
  ok,
  serverError,
  checkIfIdIsValid,
  badRequest,
} from '../helpers/index.js';

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId);

      if (deletedUser === null) {
        return badRequest({
          message: 'User not found',
        });
      }

      return ok({
        message: 'User deleted successfully',
        transaction: deletedUser,
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse(httpRequest.params.userId);
      }
      console.error('Error in delete user controller:', error);
      return serverError();
    }
  }
}
