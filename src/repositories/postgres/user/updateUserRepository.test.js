import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures'
import { PostgresUpdateUserRepository } from './updateUser'

describe('PostgresUpdateUserRepository', () => {
  const updateUserParams = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  it('should update user on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresUpdateUserRepository()

    //act
    const result = await sut.execute(user.id, updateUserParams)

    //assert
    expect(result).toStrictEqual(updateUserParams)
  })
})
