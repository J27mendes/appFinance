import validator from 'validator';
import { z } from 'zod';

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
      required_error: 'Date is required',
    })
    .datetime({
      message:
        'Date must be a valid date... Example of date 1900-01-01T00:00:00.000Z',
    }),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    errorMap: () => ({
      message: 'Type must be EXPENSE, EARNING, INVESTMENT.',
    }),
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
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
});

export const updateTransactionSchema = createTransactionSchema
  .omit({ user_id: true })
  .partial();

export const getTransactionByUserIdSchema = z.object({
  user_id: z.string().uuid(),
  from: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid 'from' date format",
    })
    .transform((val) => new Date(val)),
  to: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid 'to' date format",
    })
    .transform((val) => new Date(val)),
});
