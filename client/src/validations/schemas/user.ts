import { Categories } from '@/constants/categories';
import { Regex } from '@/constants/regex';
import type { TFunction } from 'i18next';
import z from 'zod';
import { getUsernameCommonSchema, getPasswordCommonSchema } from './commons';

export const getLoginSchema = (t: TFunction) =>
  z.object({
    loginName: z
      .string()
      .min(2, { message: t('form.errors.authentication.loginName_min') })
      .regex(Regex.LOGIN_NAME, { message: t('form.errors.authentication.loginName_invalid') }),
    password: z
      .string()
      .min(1, { message: t('form.errors.authentication.password_required') })
      .max(255, { message: t('form.errors.authentication.password_max') }),
  });

export const getRegisterSchema = (t: TFunction) =>
  z
    .object({
      username: getUsernameCommonSchema(t),
      email: z.string().email({ message: t('form.errors.authentication.email_invalid') }),
      password: getPasswordCommonSchema(t),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('form.errors.authentication.password_do_not_match'),
      path: ['confirmPassword'],
    });

export const getForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z.string().email({ message: t('form.errors.forgot_password.email_invalid') }),
  });

export const getUpdateUserSchema = (t: TFunction) =>
  z.object({
    username: getUsernameCommonSchema(t),
    email: z.string().email({ message: t('form.errors.authentication.email_invalid') }),
    preferredCategory: z.enum(Object.values(Categories) as [string, ...string[]]).optional(),
  });

export const getUpdatePasswordSchema = (t: TFunction) =>
  z
    .object({
      currentPassword: getPasswordCommonSchema(t),
      newPassword: getPasswordCommonSchema(t),
      newPasswordConfirm: z.string(),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
      message: t('form.errors.authentication.password_do_not_match'),
      path: ['newPasswordConfirm'],
    });

export const getResetPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: getPasswordCommonSchema(t),
      newPasswordConfirm: z.string(),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
      message: t('form.errors.reset_password.password_do_not_match'),
      path: ['newPasswordConfirm'],
    });

export const getDeleteUserSchema = (t: TFunction) =>
  z.object({
    checkApproval: z.boolean().refine(val => val === true, {
      message: t('form.errors.delete_account.check_approval'),
    }),
  });
