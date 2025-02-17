import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string({
      required_error: 'First name is required.',
    })
    .trim()
    .min(2, {
      message: 'First name is required.',
    }),
  last_name: z
    .string({
      required_error: 'Last name is required.',
    })
    .trim()
    .min(2, {
      message: 'Last name is required.',
    }),
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Please provide a valid e-mail',
    })
    .trim()
    .min(12, {
      message: 'Email is required.',
    }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .trim()
    .min(6, {
      message: 'Password must have at least 6 characters.',
    }),
});

export const updateUserSchena = createUserSchema.partial().strict({
  message: 'Some provided field is not allowed.',
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Please provide a valid e-mail.',
    })
    .trim()
    .min(1, { message: 'E-mail is required.' }),
  password: z.string().trim().min(6, {
    message: 'Password must have at least 6 characters.',
  }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, {
    message: 'Refresh token is required.',
  }),
});

export const getUserBalanceSchema = z.object({
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
