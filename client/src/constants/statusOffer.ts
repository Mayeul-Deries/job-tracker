export const StatusOffer = {
  SENT: 'SENT',
  FOLLOWED_UP: 'FOLLOWED_UP',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type StatusType = (typeof StatusOffer)[keyof typeof StatusOffer];
