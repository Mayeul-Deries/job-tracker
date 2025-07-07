export const defaultJobApplication = {
  title: 'Software Engineer Apprenticeship',
  company: 'A Company',
  link: 'https://example-software.com/job',
  date: new Date(),
  status: 'SENT',
  notes: 'Some notes',
  category: 'APPRENTICESHIP',
  city: 'Paris',
  favorite: false,
};

export const otherJobApplication = {
  title: 'Web Developer Internship',
  company: 'An other Company',
  link: 'https://example-web.com/job',
  date: new Date(),
  status: 'SENT',
  notes: 'Other notes',
  category: 'INTERNSHIP',
  city: 'Lyon',
  favorite: false,
};

export const jobApplicationWithMissingFields = {
  link: 'https://example-software.com/job',
  status: 'SENT',
  notes: 'Some notes',
  category: 'APPRENTICESHIP',
};
