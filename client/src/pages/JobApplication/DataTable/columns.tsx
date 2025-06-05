import type { JobApplication } from '@/interfaces/JobApplication';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<JobApplication>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'link',
    header: 'Link',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
];
