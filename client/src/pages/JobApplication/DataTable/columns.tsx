import type { JobApplication } from '@/interfaces/JobApplication';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { FileText } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/customs/DatePicker';
import { StatusSelect } from '@/components/customs/StatusSelect';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { t } from 'i18next';

export const columns: ColumnDef<JobApplication>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('pages.dataTable.columns.jobTitle')}
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
        {t('pages.dataTable.columns.companyName')}
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
        {t('pages.dataTable.columns.city')}
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
        {t('pages.dataTable.columns.applicationDate')}
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
        {t('pages.dataTable.columns.category')}
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return t(`categories.${category}`);
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('pages.dataTable.columns.status')}
        <ArrowUpDown className='ml-1' />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <StatusSelect
          value={status}
          withBorder={false}
          onChange={newStatus => {
            console.log('Status changed:', newStatus);
          }}
        />
      );
    },
  },
  {
    accessorKey: 'link',
    header: () => <span className='font-bold'>{t('pages.dataTable.columns.link')}</span>,
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
    header: () => <span className='font-bold'>{t('pages.dataTable.columns.notes')}</span>,
    cell: ({ row }) => {
      const existingNotes = row.getValue('notes') as string;
      const [notes, setNotes] = useState(existingNotes || '');

      const handleNotesChange = (value: string) => {
        setNotes(value);
      };

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8'>
              <FileText className='size-4' />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Notes</DialogTitle>
              <DialogDescription>Vous pouvez modifier vos notes ici</DialogDescription>
            </DialogHeader>
            <Textarea
              value={notes}
              className='min-h-[200px] max-w-[375px] resize-none'
              onChange={e => handleNotesChange(e.target.value)}
              placeholder='Ajouter des notes...'
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
