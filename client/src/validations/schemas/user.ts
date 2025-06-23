import { Regex } from '@/constants/regex';
import type { TFunction } from 'i18next';
import z from 'zod';

export const getLoginSchema = (t: TFunction) =>
  z.object({
    loginName: z
      .string()
      .min(2, { message: t('pages.login.errors.loginName_min') })
      .regex(Regex.LOGIN_NAME, { message: t('pages.login.errors.loginName_no_spaces') }),
    password: z
      .string()
      .min(1, { message: t('pages.login.errors.password_min') })
      .max(255, { message: t('pages.login.errors.password_max') }),
  });

export const getRegisterSchema = (t: TFunction) =>
  z
    .object({
      username: z
        .string()
        .min(2, { message: t('pages.register.errors.username_min') })
        .max(25, { message: t('pages.register.errors.username_max') })
        .regex(Regex.USERNAME, {
          message: t('pages.register.errors.username_regex'),
        }),
      email: z.string().email({ message: t('pages.register.errors.email_invalid') }),
      password: z
        .string()
        .max(255, { message: t('pages.register.errors.password_max') })
        .regex(Regex.PASSWORD, {
          message: t('pages.register.errors.password_regex'),
        }),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('pages.register.errors.password_do_not_match'),
      path: ['confirmPassword'],
    });

export const getUpdateUserSchema = (t: TFunction) =>
  z.object({
    username: z
      .string()
      .min(2, { message: t('pages.register.errors.username_min') })
      .max(25, { message: t('pages.register.errors.username_max') })
      .regex(Regex.USERNAME, {
        message: t('pages.register.errors.username_regex'),
      }),
    email: z.string().email({ message: t('pages.register.errors.email_invalid') }),
  });

export const getUpdatePasswordSchema = (t: TFunction) =>
  z
    .object({
      currentPassword: z
        .string()
        .max(255, { message: t('pages.profile.password_changer.errors.password_max') })
        .regex(Regex.PASSWORD, {
          message: t('pages.profile.password_changer.errors.password_regex'),
        }),
      newPassword: z
        .string()
        .max(255, { message: t('pages.profile.password_changer.errors.password_max') })
        .regex(Regex.PASSWORD, {
          message: t('pages.profile.password_changer.errors.password_regex'),
        }),
      newPasswordConfirm: z.string(),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
      message: t('pages.profile.password_changer.errors.passwords_do_not_match'),
      path: ['newPasswordConfirm'],
    });
