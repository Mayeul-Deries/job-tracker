import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: 'All fields are required' })
      .min(2)
      .max(25)
      .regex(/^[a-z0-9_.-]+$/, {
        message:
          'Username can only contain letters, numbers, and underscores, with no spaces, special characters and capital letter',
      }),
    email: z.string({ required_error: 'All fields are required' }).email(),
    password: z
      .string({ required_error: 'All fields are required' })
      .max(255)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
        message:
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmPassword: z.string({ required_error: 'All fields are required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  loginName: z
    .string({ required_error: 'All fields are required' })
    .min(2)
    .regex(/^[^A-Z\s]+$/, {
      message: 'Username can only contain letters, numbers, and underscores, with no spaces or special characters',
    }),
  password: z.string({ required_error: 'All fields are required' }).min(1).max(255),
});

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'All fields are required' }).email(),
});
