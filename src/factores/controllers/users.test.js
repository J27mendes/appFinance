import { CreateUserController } from '../../controllers'
import { makePostUser } from './users'

describe('Users Controllers Factories', () => {
  it('should return a valid CreateUserController instance', () => {
    expect(makePostUser()).toBeInstanceOf(CreateUserController)
  })
})
