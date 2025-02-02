import { DeleteTransactionUseCase } from './deleteTransactionUseCase'
import { UserNotFoundError } from '../../errors/userNotFoundError'
import { transaction } from '../../tests/fixtures/index'

describe('DeleteTransaction', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return { transaction }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should deleteTransaction when user found', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(transaction)

        //assert
        expect(result).toEqual({ transaction })
    })

    it('should the user cannot be found, receive the error UserNotFoundError', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()

        const transactionId = transaction.id
        const userNotFoundError = new UserNotFoundError(transactionId)

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(userNotFoundError)

        // Act & Assert
        await expect(sut.execute(transactionId)).rejects.toThrow(
            UserNotFoundError,
        )
    })
})
