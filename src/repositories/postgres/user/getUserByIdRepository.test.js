import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures'
import { PostgresGetUserByIdRepository } from './getUserById'

describe('PostgresGetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByIdRepository()

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toStrictEqual(user)
    })

    it('should call Prisma withc correct params', async () => {
        //arrange
        const sut = new PostgresGetUserByIdRepository()
        const primsaSpy = jest.spyOn(prisma.user, 'findUnique')

        //act
        await sut.execute(fakeUser.id)

        //assert
        expect(primsaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        })
    })

    it('should throws if Prisma throw', async () => {
        //arrange
        const sut = new PostgresGetUserByIdRepository()
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(fakeUser.id)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
