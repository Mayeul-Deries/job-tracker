import { type Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className={cn('cursor-pointer font-bold -ml-3 h-8', className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span>{t(`pages.dataTable.columns.${title}`)}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDown className='ml-1 h-4 w-4' />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUp className='ml-1 h-4 w-4' />
      ) : (
        <ChevronsUpDown className='ml-1 h-4 w-4' />
      )}
    </Button>
  );
}
