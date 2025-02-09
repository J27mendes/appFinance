import { auth } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';

import.meta.jest.mock('jsonwebtoken');
describe('auth middleares', () => {
  it('should return 401 if authorization token is missing', async () => {
    //arrange
    const request = {
      headers: {},
    };

    const response = {
      status: import.meta.jest.fn().mockReturnThis(),
      send: import.meta.jest.fn(),
    };

    const next = import.meta.jest.fn();
    await auth(request, response, next);

    //act & assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if jwt check is invalid', async () => {
    //arrange
    const request = {
      headers: { authorization: 'Bearer TokenInvalido' },
    };

    const response = {
      status: import.meta.jest.fn().mockReturnThis(),
      send: import.meta.jest.fn(),
    };

    //act
    const next = import.meta.jest.fn();

    import.meta.jest.spyOn(jwt, 'verify').mockImplementationOnce(null);

    await auth(request, response, next);

    // assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is not in the correct format', async () => {
    //arrange
    const request = {
      headers: { authorization: 'Bearer TokenInvalido' },
    };

    //act
    const response = {
      status: import.meta.jest.fn().mockReturnThis(),
      send: import.meta.jest.fn(),
    };

    const next = import.meta.jest.fn();

    await auth(request, response, next);

    //assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
