import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () =>
  badRequest({ message: 'The provided id is not valid.' })

export const requiredFieldsIsMissingResponse = (field) => {
  return badRequest({
    message: `The field ${field} is required.`,
  })
}

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequestFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const value = params[field]

    const fieldIsMissing = value === undefined || value === null

    let fieldIsEmpty = false

    if (field === 'id' || field === 'user_id') {
      fieldIsEmpty = !checkIfIdIsValid(value)
    } else if (typeof value === 'string') {
      fieldIsEmpty = validator.isEmpty(value, { ignore_whitespace: true })
    } else if (typeof value === 'number') {
      fieldIsEmpty = isNaN(value)
    }

    if (fieldIsMissing || fieldIsEmpty) {
      console.log(
        `Field check - field: ${field}, fieldIsMissing: ${fieldIsMissing}, fieldIsEmpty: ${fieldIsEmpty}`,
      )

      return {
        missingField: false,
        ok: false,
      }
    }
  }
  return {
    ok: true,
    missingField: undefined,
  }
}
