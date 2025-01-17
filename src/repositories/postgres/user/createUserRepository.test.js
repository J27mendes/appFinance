import { PostgresCreateUserRepository } from './createUser'
import { user } from '../../../tests/fixtures/index'

describe('CreateUserRepository', () => {
  it('should create a user on db', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository()

    //act
    const result = await sut.execute(user)

    //assert
    expect(result).toBeTruthy()
  })
})
