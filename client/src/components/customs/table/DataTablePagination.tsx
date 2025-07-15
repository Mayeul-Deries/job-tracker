import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  dataCount: number;
}

export function DataTablePagination<TData>({ table, dataCount }: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col sm:flex-row w-full items-center justify-between'>
      <div className='hidden sm:block text-muted-foreground text-sm'>
        {table.getFilteredSelectedRowModel().rows.length} {t('pages.dataTable.pagination.of')}{' '}
        {table.getFilteredRowModel().rows.length} {t('pages.dataTable.pagination.rows_selected')}
      </div>
      <div className='flex items-center gap-4 sm:gap-6 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium whitespace-nowrap'>{t('pages.dataTable.pagination.rows_per_page')}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px] cursor-pointer'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 25, 50].map(pageSize => (
                <SelectItem className='cursor-pointer' key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-center text-sm font-medium md:w-[230px]'>
          <span className='hidden md:inline'>{t('pages.dataTable.pagination.page')}&nbsp;</span>{' '}
          {table.getState().pagination.pageIndex + 1} {t('pages.dataTable.pagination.of')} {table.getPageCount()}{' '}
          <span className='hidden md:inline'>
            &nbsp; — {t('pages.dataTable.pagination.total_rows')} {dataCount}
          </span>
        </div>

        <div className='flex items-center gap-1 sm:gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='hidden lg:flex size-8 cursor-pointer'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{t('pages.dataTable.pagination.go_first')}</span>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{t('pages.dataTable.pagination.previous')}</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{t('pages.dataTable.pagination.next')}</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='hidden lg:flex size-8 cursor-pointer'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{t('pages.dataTable.pagination.go_last')}</span>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
