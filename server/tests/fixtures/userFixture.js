import fs from 'fs';

export const defaultUser = {
  username: 'johndoe',
  email: 'john@example.com',
  password: 'Johndoe123*',
};

export const otherUser = {
  username: 'janedoe',
  email: 'jane@example.com',
  password: 'Janedoe123*',
};

export const userRegistration = {
  username: 'johnregister',
  email: 'john.register@example.com',
  password: 'Johnregister123*',
  confirmPassword: 'Johnregister123*',
};

export const pathExistingAvatar = './uploads/users/avatars/test-avatar.png';

export const userWithAvatar = {
  username: 'test',
  email: 'test@example.com',
  password: 'Test123*',
  avatar: pathExistingAvatar,
};
