import type { CategoryType } from '@/constants/categories';
import type { StatusType } from '@/constants/statusOffer';

export interface JobApplication {
  _id: string;
  title: string;
  company: string;
  city: string;
  date: Date;
  category: CategoryType;
  status: StatusType;
  link: string;
  notes: string;
  favorite: boolean;
  createdAt: string;
  updatedAt?: string;
  __v: number;
}
