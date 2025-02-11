import { ZodError } from 'zod';
import { UnauthorizedError } from '../../errors/index.js';
import { refreshTokenSchema } from '../../schemas/user.js';
import { badRequest, ok, serverError, unauthorized } from '../helpers/index.js';

export class RefreshTokenController {
  constructor(refreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      await refreshTokenSchema.parseAsync(params);
      const response = await this.refreshTokenUseCase.execute(
        params.refreshToken,
      );

      return ok(response);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        });
      }
      if (error instanceof UnauthorizedError) {
        return unauthorized();
      }
      return serverError();
    }
  }
}
