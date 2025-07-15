export const Actions = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  DELETE_MANY: 'DELETE_MANY',
  DUPLICATE: 'DUPLICATE',
} as const;

export type ActionType = (typeof Actions)[keyof typeof Actions];
