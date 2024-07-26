import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfAmountIsValid = (amount) => {
  validator.isCurrency(amount.toString(), {
    digits_after_decimal: [2],
    allow_negatives: false,
    decimal_separator: '.',
  })
}

export const checkIfTypeIsValid = (type) =>
  ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmountResponse = () =>
  badRequest({
    message: 'The amount must be id currency.',
  })

export const invalidTypeResponse = () =>
  badRequest({
    message: 'The type must be EARNING, EXPENSE or INVESTMENT.',
  })
