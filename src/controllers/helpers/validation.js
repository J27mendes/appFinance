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
  console.log(`apos validateRequestFields, ${params} , e ${requiredFields} fim`)
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field]
    const fieldIsEmpty =
      checkIfIdIsValid(params[field]) &&
      validator.isEmpty(params[field], {
        ignore_whitespace: true,
      })

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
