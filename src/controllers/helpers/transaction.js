import { notFound } from './http.js'

export const transactionNotFoundResponse = (id) =>
    notFound({ message: `User with ${id} not found.` })
