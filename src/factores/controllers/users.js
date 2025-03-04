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
  LoginUserUseCase,
  RefreshTokenUseCase,
} from '../../useCases/index.js';
import {
  GetUserByIdController,
  CreateUserController,
  UpdateUserController,
  DeleteUserController,
  GetUserBalanceController,
  LoginUserController,
  RefreshTokenController,
} from '../../controllers/index.js';
import {
  PasswordHasherAdapter,
  IdGeneratorAdapter,
  PasswordComparatorAdapter,
  TokensGeneratorAdapter,
  TokenVerifierAdapter,
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
  const tokenGeneretorAdapter = new TokensGeneratorAdapter();
  const createUser = new CreateUserUseCase(
    compareEmail,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokenGeneretorAdapter,
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

export const makeLoginUserController = () => {
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const compareEmail = new PostgresCompareEmail();
  const loginUserUseCase = new LoginUserUseCase(
    compareEmail,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );
  const loginUserController = new LoginUserController(loginUserUseCase);

  return loginUserController;
};

export const makeRefreshTokenController = () => {
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const tokenVerifierAdapter = new TokenVerifierAdapter();
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokensGeneratorAdapter,
    tokenVerifierAdapter,
  );
  const refreshTokenController = new RefreshTokenController(
    refreshTokenUseCase,
  );

  return refreshTokenController;
};
