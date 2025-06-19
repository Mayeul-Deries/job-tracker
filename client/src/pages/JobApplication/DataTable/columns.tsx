import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { cn } from '@/lib/utils';

import { ExternalLink, FileText, MoreVertical, Pencil, Star, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/customs/table/DatePicker';
import { StatusSelect } from '@/components/customs/table/StatusSelect';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/customs/table/DataTableColumnHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const getColumns = (
  t: TFunction,
  onUpdateField: (id: string, field: string, value: any) => void,
  handleJobApplicationAction: (action: string, data: any) => void
): ColumnDef<JobApplication>[] => [
  {
    id: 'select',
    size: 50,
    header: ({ table }) => (
      <Checkbox
        className='mx-2 px-auto'
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className='mx-2 px-auto'
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    size: 220,
    header: ({ column }) => <DataTableColumnHeader column={column} title='title' />,
    cell: ({ row }) => {
      const value = row.getValue('title') as string;
      const favorite = row.original.favorite as boolean;

      return (
        <div className='flex items-center justify-between w-full pr-2'>
          <div className='truncate mr-2'>{value}</div>
          <Button
            variant='ghost'
            size='icon'
            className={cn('size-8', favorite ? 'text-yellow-500' : 'hover:text-yellow-500')}
            onClick={() => onUpdateField(row.original._id, 'favorite', !favorite)}
          >
            <Star className={cn('size-4', favorite && 'fill-yellow-500')} />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: 'company',
    size: 150,
    header: ({ column }) => <DataTableColumnHeader column={column} title='company' />,
    cell: ({ row }) => {
      const value = row.getValue('company') as string;
      return <div className='truncate'>{value}</div>;
    },
  },
  {
    accessorKey: 'city',
    size: 130,
    header: ({ column }) => <DataTableColumnHeader column={column} title='city' />,
    cell: ({ row }) => {
      const value = row.getValue('city') as string;
      return <div className='truncate'>{value}</div>;
    },
  },
  {
    accessorKey: 'date',
    size: 170,
    header: ({ column }) => <DataTableColumnHeader column={column} className='ml-1' title='date' />,
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return (
        <DatePicker
          value={date}
          variant='ghost'
          onChange={newDate => {
            onUpdateField(row.original._id, 'date', newDate);
          }}
          showIcon={false}
        />
      );
    },
  },
  {
    accessorKey: 'category',
    size: 130,
    header: ({ column }) => <DataTableColumnHeader column={column} title='category' />,
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return t(`categories.${category}`);
    },
  },
  {
    accessorKey: 'status',
    size: 150,
    header: ({ column }) => <DataTableColumnHeader column={column} title='status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <StatusSelect
          status={status}
          onStatusChange={newStatus => {
            onUpdateField(row.original._id, 'status', newStatus);
          }}
          variant='table'
        />
      );
    },
  },
  {
    accessorKey: 'link',
    size: 50,
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
    size: 50,
    header: () => <span className='font-bold'>{t('pages.dataTable.columns.notes')}</span>,
    cell: ({ row }) => {
      const existingNotes = row.getValue('notes') as string;
      const [notes, setNotes] = useState(existingNotes || '');

      const handleSaveNotes = () => {
        onUpdateField(row.original._id, 'notes', notes);
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
              <DialogTitle>{t('pages.dataTable.columns.notes_dialog.title')}</DialogTitle>
              <DialogDescription>{t('pages.dataTable.columns.notes_dialog.description')}</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <Textarea
                value={notes}
                className='min-h-[200px] max-w-[375px] resize-none'
                onChange={e => setNotes(e.target.value)}
                placeholder={t('pages.dataTable.columns.notes_dialog.placeholder')}
              />
              <div className='flex justify-start'>
                <Button onClick={handleSaveNotes}>{t('pages.dataTable.columns.notes_dialog.save')}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: 'actions',
    size: 50,
    header: () => <span className='font-bold'>{t('pages.dataTable.columns.actions.title')}</span>,
    cell: ({ row }) => {
      const jobApplication = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>{t('pages.dataTable.columns.actions.title')}</DropdownMenuLabel>
            <DropdownMenuItem
              className='flex gap-2'
              onClick={() => handleJobApplicationAction('edit', jobApplication._id)}
            >
              <Pencil className='h-2' />
              {t('pages.dataTable.columns.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className='flex gap-2'
              onClick={() => handleJobApplicationAction('delete', jobApplication._id)}
            >
              <Trash className='h-2' />
              {t('pages.dataTable.columns.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
