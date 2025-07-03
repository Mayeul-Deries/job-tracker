import type { TFunction } from 'i18next';
import { z } from 'zod';

export const getUsernameCommonSchema = (t: TFunction) =>
  z
    .string()
    .min(2, { message: t('form.errors.authentication.username_min') })
    .max(25, { message: t('form.errors.authentication.username_max') })
    .refine(val => /^[a-zA-Z0-9\-_ ]*$/.test(val), {
      message: t('form.errors.authentication.username_alphanumeric'),
    })
    .refine(val => !/[A-Z]/.test(val), {
      message: t('form.errors.authentication.username_no_uppercase'),
    })
    .refine(val => !val.includes(' '), {
      message: t('form.errors.authentication.username_no_spaces'),
    })
    .refine(val => !/^(?:[-_]|.*[-_]$)/.test(val), {
      message: t('form.errors.authentication.username_no_hyphen_edges'),
    });

export const getPasswordCommonSchema = (t: TFunction) =>
  z
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
    });
