import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests/fixtures/index.js'
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

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresDeleteUserRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'delete')

    //act
    await sut.execute(user.id)

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    })
  })

  it('should handle errors gracefully', async () => {
    //arrange
    const sut = new PostgresDeleteUserRepository()
    jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

    //act
    const result = await sut.execute(user)

    //assert
    expect(result).toBeNull()
  })
})
