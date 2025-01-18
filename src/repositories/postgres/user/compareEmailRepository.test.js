import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures'
import { PostgresCompareEmail } from './compareEmail'

describe('PostgresCompareEmail', () => {
  it('should get user by email on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresCompareEmail()

    //act
    const result = await sut.execute(fakeUser.email)

    //assert
    expect(result).toStrictEqual(user)
  })

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresCompareEmail()
    const primsaSpy = jest.spyOn(prisma.user, 'findUnique')

    //act
    await sut.execute(fakeUser.email)

    //assert
    expect(primsaSpy).toHaveBeenCalledWith({
      where: {
        email: fakeUser.email,
      },
    })
  })

  it('should throws if Prisma throw', async () => {
    //arrange
    const sut = new PostgresCompareEmail()
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

    //act
    const promise = sut.execute(fakeUser.email)

    //assert
    await expect(promise).rejects.toThrow()
  })
})
