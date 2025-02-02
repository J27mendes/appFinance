import { notFound } from './http.js';

export const userNotFoundResponse = (id) =>
  notFound({ message: `User with ${id} not found.` });
