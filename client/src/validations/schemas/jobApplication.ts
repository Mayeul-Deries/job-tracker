import { Categories } from '@/constants/categories';
import { StatusOffer } from '@/constants/statusOffer';
import type { TFunction } from 'i18next';
import z from 'zod';

export const getJobApplicationSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, { message: t('form.errors.jobApplication.jobTitle_required') }),
    company: z.string().min(1, { message: t('form.errors.jobApplication.companyName_required') }),
    location: z.string().min(1, { message: t('form.errors.jobApplication.city_required') }),
    date: z.date({ required_error: t('form.errors.jobApplication.applicationDate_required') }),
    category: z.enum([
      Categories.INTERNSHIP,
      Categories.APPRENTICESHIP,
      Categories.FULL_TIME,
      Categories.PART_TIME,
      Categories.FREELANCE,
      Categories.CONTRACT,
      Categories.SEASONAL,
    ]),
    status: z.enum([
      StatusOffer.SENT,
      StatusOffer.FOLLOWED_UP,
      StatusOffer.INTERVIEW_SCHEDULED,
      StatusOffer.AWAITING_RESPONSE,
      StatusOffer.ACCEPTED,
      StatusOffer.REJECTED,
    ]),
    link: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(val => !val || /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/.test(val), {
        message: t('form.errors.jobApplication.link_invalid'),
      }),
    notes: z.string().optional().or(z.literal('')),
  });
