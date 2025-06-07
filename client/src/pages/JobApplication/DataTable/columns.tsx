import type { JobApplication } from '@/interfaces/JobApplication';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { FileText } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/customs/DatePicker';
import { StatusSelect } from '@/components/customs/StatusSelect';

export const columns: ColumnDef<JobApplication>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Company
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        City
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return (
        <DatePicker
          value={date}
          variant='ghost'
          onChange={newDate => {
            console.log('Date changed:', newDate);
          }}
          showIcon={false}
        />
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Category
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <StatusSelect
          value={status}
          onChange={newStatus => {
            console.log('Status changed:', newStatus);
          }}
        />
      );
    },
  },
  {
    accessorKey: 'link',
    header: 'Link',
    cell: ({ row }) => {
      const link = row.getValue('link') as string;
      return link ? (
        <Button variant='ghost' size='icon' asChild className='size-8'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='size-4' />
          </a>
        </Button>
      ) : null;
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string;
      return notes ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8'>
              <FileText className='size-4' />
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Notes</DialogTitle>
            </DialogHeader>
            <div className='mt-4 text-sm'>{notes}</div>
          </DialogContent>
        </Dialog>
      ) : null;
    },
  },
];
