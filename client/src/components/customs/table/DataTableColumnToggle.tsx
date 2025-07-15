import { useEffect, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { Actions, type ActionType } from '@/constants/actions';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Search, Settings2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '@/components/ui/label';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  onAction: (action: ActionType, data: TData[]) => void;
}

export function DataTableViewOptions<TData>({ table, onAction }: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    table.setGlobalFilter(debouncedSearch);
  }, [debouncedSearch, table]);

  const selectedRows = table.getSelectedRowModel().rows;
  return (
    <div className='flex items-end gap-2 justify-between'>
      <div className='flex flex-col flex-grow max-w-[300px]'>
        <Label htmlFor='search' className='text-sm font-medium text-gray-700'>
          {t('pages.dataTable.search.label')}
        </Label>
        <div className='relative mt-1'>
          <Search className='hidden sm:block absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder={t('pages.dataTable.search.placeholder')}
            value={search}
            onChange={event => setSearch(event.target.value)}
            className='w-full pl-3 sm:pl-10 truncate placeholder:text-sm'
          />
        </div>
      </div>

      <div className='flex gap-2'>
        <Button
          onClick={() => {
            const selected = selectedRows.map(row => row.original);
            if (selected.length > 0) {
              onAction(Actions.DELETE_MANY, selected);
            }
          }}
          disabled={selectedRows.length === 0}
          className='cursor-pointer gap-2 bg-red-700 hover:bg-red-800 text-white'
        >
          <Trash2 className='h-4 w-4' />({selectedRows.length})
        </Button>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className='hidden sm:flex'>
            <Button variant='outline' className='cursor-pointer'>
              <Settings2 className='h-4 w-4' />
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
                    className='cursor-pointer'
                    key={column.id}
                    checked={column.getIsVisible()}
                    onSelect={event => event.preventDefault()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {t(`pages.dataTable.visibility.${column.id}`)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
