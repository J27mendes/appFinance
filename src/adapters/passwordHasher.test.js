import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './passwordHasher'

describe('PasswordHasherAdapter', () => {
    it('should return hashed password', async () => {
        //arrange
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        //act
        const result = await sut.execute(password)

        //asert
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).not.toBe(password)
    })
})
