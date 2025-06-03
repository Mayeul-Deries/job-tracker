export const Categories = {
  INTERNSHIP: 'Internship',
  APPRENTICESHIP: 'Apprenticeship',
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract',
  SEASONAL: 'Seasonal',
} as const;

export type CategoryType = (typeof Categories)[keyof typeof Categories];
