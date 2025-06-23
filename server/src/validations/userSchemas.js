import { z } from 'zod';

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(2)
      .regex(/^[a-z0-9_.-]+$/, {
        message: 'Username can only contain letters, numbers, and underscores, with no spaces or special characters',
      })
      .optional(),
    email: z.string().email().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .max(255, { message: 'Password must be at most 255 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/, {
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    newPassword: z
      .string()
      .max(255, { message: 'Password must be at most 255 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/, {
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    newPasswordConfirm: z.string(),
  })
  .refine(data => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords don't match",
    path: ['newPasswordConfirm'],
  });
