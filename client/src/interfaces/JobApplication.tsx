import type { CategoryType } from '@/constants/categories';
import type { StatusType } from '@/constants/statusOffer';

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  city: string;
  category: CategoryType;
  status: StatusType;
  link: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}
