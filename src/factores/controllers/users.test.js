import { CreateUserController, UpdateUserController } from '../../controllers'
import { makePostUser, makeUpdateUserById } from './users'

describe('Users Controllers Factories', () => {
  it('should return a valid CreateUserController instance', () => {
    expect(makePostUser()).toBeInstanceOf(CreateUserController)
  })

  it('should return a valid UpdateUserController instance', () => {
    expect(makeUpdateUserById()).toBeInstanceOf(UpdateUserController)
  })
})
