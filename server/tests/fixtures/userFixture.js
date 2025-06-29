import { Categories } from '../../src/utils/enums/categories';

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

export const userWithPreferredCategory = {
  username: 'johndoe',
  email: 'john@example.com',
  password: 'Johndoe123*',
  preferredCategory: Categories.FULL_TIME,
};

export const userRegistration = {
  username: 'johnregister',
  email: 'john.register@example.com',
  password: 'Johnregister123*',
  confirmPassword: 'Johnregister123*',
};

export const pathExistingAvatar = 'https://res.cloudinary.com/demo/image/upload/v1/users/avatars/test-avatar.png';

export const userWithAvatar = {
  username: 'test',
  email: 'test@example.com',
  password: 'Test123*',
  avatar: pathExistingAvatar,
};
