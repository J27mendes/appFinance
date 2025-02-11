import jwt from 'jsonwebtoken';
import { TokenVerifierAdapter } from './index.js';
import { faker } from '@faker-js/faker';

describe('TokenVerifierAdapter', () => {
  import.meta.jest.mock('jsonwebtoken');
  const makeSut = () => {
    const sut = new TokenVerifierAdapter();
    return { sut };
  };

  let token;
  let secret;
  let payload;

  beforeEach(() => {
    token = faker.string.uuid();
    secret = faker.internet.password();
    payload = { id: faker.string.uuid() };
  });

  it('should return the decoded payload when token is valid', () => {
    const { sut } = makeSut();

    import.meta.jest.spyOn(jwt, 'verify').mockImplementationOnce(() => payload);

    const result = sut.execute(token, secret);

    expect(result).toEqual(payload);
    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
  });
});
