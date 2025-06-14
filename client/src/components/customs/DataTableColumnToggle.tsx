import type { Table } from '@tanstack/react-table';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Settings2 } from 'lucide-react';
import { t } from 'i18next';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <div className='flex items-center gap-2'>
      <Input
        placeholder={t('pages.dataTable.search.placeholder')}
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
        className='max-w-sm truncate'
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='ml-auto'>
            <Settings2 className='mr-2 h-4 w-4' />
            {t('pages.dataTable.visibility.columns')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{t('pages.dataTable.visibility.toggle_columns')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(column => column.getCanHide())
            .map(column => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {t(`pages.dataTable.visibility.${column.id}`)}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
