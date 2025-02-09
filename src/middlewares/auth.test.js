import { auth } from '../middlewares/auth.js';

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
});
