export const defaultJobApplication = {
  title: 'Software Engineer Apprenticeship',
  company: 'A Company',
  link: 'https://example-software.com/job',
  date: new Date(),
  status: 'Sent',
  notes: 'Some notes',
  category: 'Apprenticeship',
  city: 'Paris',
};

export const otherJobApplication = {
  title: 'Web Developer Internship',
  company: 'An other Company',
  link: 'https://example-web.com/job',
  date: new Date(),
  status: 'Sent',
  notes: 'Other notes',
  category: 'Internship',
  city: 'Lyon',
};

export const jobApplicationWithMissingFields = {
  link: 'https://example-software.com/job',
  status: 'Sent',
  notes: 'Some notes',
  category: 'Apprenticeship',
};
