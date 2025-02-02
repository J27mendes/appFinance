import { UserNotFoundError } from '../../errors/userNotFoundError.js'
import {
    ok,
    requiredFieldsIsMissingResponse,
    serverError,
    userNotFoundResponse,
    checkIfIdIsValid,
    invalidIdResponse,
} from '../helpers/index.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldsIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionByUserIdUseCase.execute(userId)

            return ok(transactions)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(
                'Unexpected error in GetTransactionByUserIdController:',
                error,
            )
            return serverError()
        }
    }
}
