export const Categories = {
  INTERNSHIP: 'INTERNSHIP',
  APPRENTICESHIP: 'APPRENTICESHIP',
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  FREELANCE: 'FREELANCE',
  CONTRACT: 'CONTRACT',
  SEASONAL: 'SEASONAL',
} as const;

export type CategoryType = (typeof Categories)[keyof typeof Categories];
