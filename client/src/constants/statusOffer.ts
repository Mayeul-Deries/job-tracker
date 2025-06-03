export const StatusOffer = {
  SENT: 'Sent',
  FOLLOWED_UP: 'Followed up',
  INTERVIEW_SCHEDULED: 'Interview scheduled',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
} as const;

export type StatusType = (typeof StatusOffer)[keyof typeof StatusOffer];
