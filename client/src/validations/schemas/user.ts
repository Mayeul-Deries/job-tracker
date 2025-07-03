import { Categories } from '@/constants/categories';
import { Regex } from '@/constants/regex';
import type { TFunction } from 'i18next';
import z from 'zod';

export const getLoginSchema = (t: TFunction) =>
  z.object({
    loginName: z
      .string()
      .min(2, { message: t('form.errors.authentication.loginName_min') })
      .regex(Regex.LOGIN_NAME, { message: t('form.errors.authentication.loginName_no_spaces') }),
    password: z
      .string()
      .min(1, { message: t('form.errors.authentication.password_required') })
      .max(255, { message: t('form.errors.authentication.password_max') }),
  });

export const getRegisterSchema = (t: TFunction) =>
  z
    .object({
      username: z
        .string()
        .min(2, { message: t('form.errors.authentication.username_min') })
        .max(25, { message: t('form.errors.authentication.username_max') })
        .refine(val => /^[a-zA-Z0-9\-_ ]*$/.test(val), {
          message: t('form.errors.authentication.username_alphanumeric'),
        })
        .refine(val => !/[A-Z]/.test(val) === true, {
          message: t('form.errors.authentication.username_no_uppercase'),
        })
        .refine(val => !val.includes(' '), {
          message: t('form.errors.authentication.username_no_spaces'),
        })
        .refine(val => !/^[-_]|[-_]$/.test(val), {
          message: t('form.errors.authentication.username_no_hyphen_edges'),
        }),
      email: z.string().email({ message: t('form.errors.authentication.email_invalid') }),
      password: z
        .string()
        .min(8, { message: t('form.errors.authentication.password_min') })
        .max(255, { message: t('form.errors.authentication.password_max') })
        .refine(val => /[a-z]/.test(val), {
          message: t('form.errors.authentication.password_lowercase'),
        })
        .refine(val => /[A-Z]/.test(val), {
          message: t('form.errors.authentication.password_uppercase'),
        })
        .refine(val => /\d/.test(val), {
          message: t('form.errors.authentication.password_number'),
        })
        .refine(val => /[^A-Za-z0-9]/.test(val), {
          message: t('form.errors.authentication.password_special'),
        }),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('form.errors.authentication.password_do_not_match'),
      path: ['confirmPassword'],
    });

export const getUpdateUserSchema = (t: TFunction) =>
  z.object({
    username: z
      .string()
      .min(2, { message: t('form.errors.authentication.username_min') })
      .max(25, { message: t('form.errors.authentication.username_max') })
      .refine(val => /^[a-zA-Z0-9\-_ ]*$/.test(val), {
        message: t('form.errors.authentication.username_alphanumeric'),
      })
      .refine(val => !/[A-Z]/.test(val) === true, {
        message: t('form.errors.authentication.username_no_uppercase'),
      })
      .refine(val => !val.includes(' '), {
        message: t('form.errors.authentication.username_no_spaces'),
      })
      .refine(val => !/^[-_]|[-_]$/.test(val), {
        message: t('form.errors.authentication.username_no_hyphen_edges'),
      }),
    email: z.string().email({ message: t('form.errors.authentication.email_invalid') }),
    preferredCategory: z.enum(Object.values(Categories) as [string, ...string[]]).optional(),
  });

export const getUpdatePasswordSchema = (t: TFunction) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(8, { message: t('form.errors.authentication.password_min') })
        .max(255, { message: t('form.errors.authentication.password_max') })
        .refine(val => /[a-z]/.test(val), {
          message: t('form.errors.authentication.password_lowercase'),
        })
        .refine(val => /[A-Z]/.test(val), {
          message: t('form.errors.authentication.password_uppercase'),
        })
        .refine(val => /\d/.test(val), {
          message: t('form.errors.authentication.password_number'),
        })
        .refine(val => /[^A-Za-z0-9]/.test(val), {
          message: t('form.errors.authentication.password_special'),
        }),
      newPassword: z
        .string()
        .min(8, { message: t('form.errors.authentication.password_min') })
        .max(255, { message: t('form.errors.authentication.password_max') })
        .refine(val => /[a-z]/.test(val), {
          message: t('form.errors.authentication.password_lowercase'),
        })
        .refine(val => /[A-Z]/.test(val), {
          message: t('form.errors.authentication.password_uppercase'),
        })
        .refine(val => /\d/.test(val), {
          message: t('form.errors.authentication.password_number'),
        })
        .refine(val => /[^A-Za-z0-9]/.test(val), {
          message: t('form.errors.authentication.password_special'),
        }),
      newPasswordConfirm: z.string(),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
      message: t('form.errors.authentication.password_do_not_match'),
      path: ['newPasswordConfirm'],
    });

export const getDeleteUserSchema = (t: TFunction) =>
  z.object({
    checkApproval: z.boolean().refine(val => val === true, {
      message: t('form.errors.delete_account.check_approval'),
    }),
  });
