import {
  PostgresGetUserByIdRepository,
  PostgresCreateUserRepository,
  PostgresUpdateUserRepository,
  PostgresDeleteUserRepository,
  PostgresCompareEmail,
  PostgresGetUserBalanceRepository,
} from '../../repositories/postgres/index.js';
import {
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
} from '../../useCases/index.js';
import {
  GetUserByIdController,
  CreateUserController,
  UpdateUserController,
  DeleteUserController,
  GetUserBalanceController,
} from '../../controllers/index.js';
import {
  PasswordHasherAdapter,
  IdGeneratorAdapter,
} from '../../adapters/index.js';

export const makeGetUserById = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  return getUserByIdController;
};

export const makePostUser = () => {
  const compareEmail = new PostgresCompareEmail();
  const createUserRepository = new PostgresCreateUserRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createUser = new CreateUserUseCase(
    compareEmail,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  );
  const createUserController = new CreateUserController(createUser);

  return createUserController;
};

export const makeUpdateUserById = () => {
  const postgresCompareEmail = new PostgresCompareEmail();
  const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const updateUserUseCase = new UpdateUserUseCase(
    postgresCompareEmail,
    postgresUpdateUserRepository,
    passwordHasherAdapter,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);
  return updateUserController;
};

export const makeDeleteUserById = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  return deleteUserController;
};

export const makeGetUserBalanceController = () => {
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserBalanceRepository,
    getUserByIdRepository,
  );
  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  );

  return getUserBalanceController;
};
