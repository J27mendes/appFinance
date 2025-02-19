import { TransactionNotFoundError } from '../../errors/transactionNotFoundError.js';
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  transactionNotFoundResponse,
} from '../helpers/index.js';

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const userId = httpRequest.params.user_id;

      const transactionIdIsValid = checkIfIdIsValid(transactionId);

      const userIsIdValid = checkIfIdIsValid(userId);

      if (!transactionIdIsValid || !userIsIdValid) {
        return invalidIdResponse();
      }

      const deletedTransaction = await this.deleteTransactionUseCase.execute(
        transactionId,
        userId,
      );

      if (deletedTransaction === null) {
        return badRequest({
          message: 'Transaction not found',
        });
      }

      return ok(deletedTransaction);
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse(httpRequest.params.transactionId);
      }

      return serverError();
    }
  }
}
