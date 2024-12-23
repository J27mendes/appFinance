import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfAmountIsValid = (amount) => {
  const amountStr = typeof amount === 'number' ? amount.toFixed(2) : amount

  return validator.isCurrency(amountStr, {
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
