import validator from 'validator'
import { z } from 'zod'

export const createTransactionSchema = z.object({
  user_id: z
    .string({
      required_error: 'User ID is required.',
    })
    .uuid({
      message: 'User ID must be a valid UUID.',
    }),
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .trim()
    .min(1, {
      message: 'Name is required.',
    }),
  date: z
    .string({
      required_error: 'Dte is required.',
    })
    .datetime({
      message: 'Date must be a valid date.',
    }),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    errorMap: () => ({
      message: 'Type must be EXPENSE, EARNING or INVESTMENT.',
    }),
  }),
  amount: z
    .number({
      invalid_type_error: 'Amount must be a number.',
    })
    .min(1, {
      message: 'Amount must be greater than 0.',
    })
    .refine((value) =>
      validator.isCurrency(value.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      }),
    ),
})
