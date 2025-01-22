import {
  CreateTransactionController,
  GetTransactionByUserIdController,
} from '../../controllers'
import {
  makeCreateTransactionController,
  makeGetTransactionByUserIdController,
} from './transactions'

describe('Transaction Controller Factories', () => {
  it('should return a valid CreateTransactionController instance', () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    )
  })
})
