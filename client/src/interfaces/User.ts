import type { Categories } from '@/constants/categories';

export interface UserInterface {
  _id: string;
  avatar?: string;
  username: string;
  email: string;
  preferredCategory?: keyof typeof Categories;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
