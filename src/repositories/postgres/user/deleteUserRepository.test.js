import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests/fixtures'
import { PostgresDeleteUserRepository } from './deleteUser'

describe('PostgresDeleteUserRepository', () => {
  it('should delete a user on db', async () => {
    //arrange
    await prisma.user.create({
      data: user,
    })
    const sut = new PostgresDeleteUserRepository()

    //act
    const result = await sut.execute(user.id)

    //assert
    expect(result).toStrictEqual(user)
  })
})
