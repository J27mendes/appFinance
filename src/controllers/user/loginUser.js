import { ZodError } from 'zod';
import { loginSchema } from '../../schemas/index';
import { badRequest, ok, serverError } from '../helpers';

export class LoginUserController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      await loginSchema.parseAsync(params);
      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      );
      return ok(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        });
      }
      return serverError;
    }
  }
}
