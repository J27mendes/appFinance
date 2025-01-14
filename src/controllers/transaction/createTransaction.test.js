import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'
import { CreateTransactionController } from './controllerTransaction.js'

describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction
    }
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCase)

    return {
      sut,
      createTransactionUseCase,
    }
  }

  const baseHttpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  }

  it('should return 201 when creating transaction successfully with type = { EXPENSE }', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when creating transaction successfully with type = { EARNING }', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'EARNING',
      },
    })

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when creating transaction successfully with type = { INVESTMENT }', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'INVESTMENT',
      },
    })

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should call CreateTransactionUseCase witch correct params', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut()
    const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

    //act
    await sut.execute(baseHttpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
  })

  it('should return 400 when missing user_id', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        user_id: undefined,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing name', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        name: undefined,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing date', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: undefined,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing type', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'undefined',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing amount', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: undefined,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing date invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: 'invalid_date',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when amount is not a valid currency', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: 'invalid_amount',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 500 when createTransactionUseCase throws', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut()
    jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(500)
  })

  it('should return 400 if createTransactionUseCase throws', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut()
    const validationError = new ZodError([
      {
        path: ['field'],
        message: 'Validation error message',
        code: 'invalid_type',
      },
    ])

    jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw validationError
      })

    //act
    const result = await sut.execute({
      body: {
        ...baseHttpRequest.undefined,
      },
    })

    //assert
    expect(result.statusCode).toBe(400)
  })
})
