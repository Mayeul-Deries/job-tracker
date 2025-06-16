import { Categories } from '@/constants/categories';
import { StatusOffer } from '@/constants/statusOffer';
import type { TFunction } from 'i18next';
import z from 'zod';

export const getJobApplicationSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, { message: t('pages.createJobApplication.errors.jobTitle_required') }),
    company: z.string().min(1, { message: t('pages.createJobApplication.errors.companyName_required') }),
    city: z.string().min(1, { message: t('pages.createJobApplication.errors.city_required') }),
    date: z.date({ required_error: t('pages.createJobApplication.errors.applicationDate_required') }),
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
      StatusOffer.ACCEPTED,
      StatusOffer.REJECTED,
    ]),
    link: z.string().url(t('pages.createJobApplication.errors.link_invalid')).optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
  });
