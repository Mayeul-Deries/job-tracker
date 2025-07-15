import { Actions } from '@/constants/actions';
import type { JobApplication } from '@/interfaces/JobApplication';

export type updateActionType =
  | { type: typeof Actions.CREATE; payload: JobApplication }
  | { type: typeof Actions.DUPLICATE; payload: JobApplication }
  | { type: typeof Actions.EDIT; payload: JobApplication }
  | { type: typeof Actions.DELETE; payload: string }
  | { type: typeof Actions.DELETE_MANY; payload: string[] };
