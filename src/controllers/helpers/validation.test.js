import { faker } from '@faker-js/faker';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  requiredFieldsIsMissingResponse,
} from './index.js';

jest.mock('./http.js', () => ({
  badRequest: jest.fn((data) => data),
}));

describe('validation Functions Tests', () => {
  it('checkIfIdIsValid must return true for a valid UUID', () => {
    const validUUID = faker.string.uuid();
    expect(checkIfIdIsValid(validUUID)).toBe(true);
  });

  it('checkIfIdIsValid must return false for an invalid UUID', () => {
    const invalidUUID = '1234';
    expect(checkIfIdIsValid(invalidUUID)).toBe(false);
  });

  it('invalidIdResponse must return an error object with the correct message', () => {
    expect(invalidIdResponse()).toEqual({
      message: 'The provided id is not valid.',
    });
  });

  it('requiredFieldsIsMissingResponse must return an error object with the correct message', () => {
    const field = 'name';
    expect(requiredFieldsIsMissingResponse(field)).toEqual({
      message: `The field ${field} is required.`,
    });
  });
});
