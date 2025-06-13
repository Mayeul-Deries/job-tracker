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
