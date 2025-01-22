import {
  CreateTransactionController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from '../../controllers'
import {
  makeCreateTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from './transactions'

describe('Transaction Controller Factories', () => {
  it('should return a valid CreateTransactionController instance', () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    )
  })

  it('should return a valid GetTransactionByUserIdController instance', () => {
    expect(makeGetTransactionByUserIdController()).toBeInstanceOf(
      GetTransactionByUserIdController,
    )
  })

  it('should return a valid UpdateTransactionController instance', () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    )
  })
})
