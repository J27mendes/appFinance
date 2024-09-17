import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
  badRequest({ message: 'Password must be at least 6 characters.' })

export const emailIsAlreadyInUseResponse = () =>
  badRequest({ message: 'Invalid e-mail. Please provide a valide one.' })

export const userNotFoundResponse = (id) =>
  notFound({ message: `User with ${id} not found.` })
