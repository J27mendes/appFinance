import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
} from '../../controllers';
import {
  makeDeleteUserById,
  makeGetUserBalanceController,
  makeGetUserById,
  makePostUser,
  makeUpdateUserById,
} from './users';

describe('Users Controllers Factories', () => {
  it('should return a valid GetUserByIdController instance', () => {
    expect(makeGetUserById()).toBeInstanceOf(GetUserByIdController);
  });

  it('should return a valid CreateUserController instance', () => {
    expect(makePostUser()).toBeInstanceOf(CreateUserController);
  });

  it('should return a valid UpdateUserController instance', () => {
    expect(makeUpdateUserById()).toBeInstanceOf(UpdateUserController);
  });

  it('should return a valid DeleteUserController instance', () => {
    expect(makeDeleteUserById()).toBeInstanceOf(DeleteUserController);
  });

  it('should return a valid GetUserBalanceController instance', () => {
    expect(makeGetUserBalanceController()).toBeInstanceOf(
      GetUserBalanceController,
    );
  });
});
