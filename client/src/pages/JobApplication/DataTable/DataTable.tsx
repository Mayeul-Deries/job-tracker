import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  type ColumnDef,
  flexRender,
  getSortedRowModel,
  getCoreRowModel,
  type SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { customGlobalFilter } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/customs/table/DataTablePagination';
import { DataTableViewOptions } from '@/components/customs/table/DataTableColumnToggle';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  fetchData: (pageIndex: number, pageSize: number) => void;
  dataCount: number;
  onAction: (action: string, data: TData[]) => void;
  onResetSelectionRef?: (resetFn: () => void) => void;
  onPaginationResetRef?: (resetFn: () => void) => void;
  onPaginationInfoRef?: (info: { getPagination: () => { pageIndex: number; pageSize: number } }) => void;
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  fetchData,
  dataCount,
  onAction,
  onResetSelectionRef,
  onPaginationResetRef,
  onPaginationInfoRef,
}: DataTableProps<TData>) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const sortedData = useMemo(() => {
    if (sorting.length === 0) {
      return [...data].sort((a: any, b: any) => {
        if (a.favorite === b.favorite) {
          const createdAtDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (createdAtDiff !== 0) {
            return createdAtDiff;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.favorite ? -1 : 1;
      });
    }
    return data;
  }, [data, sorting]);

  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (onResetSelectionRef) {
      onResetSelectionRef(() => setRowSelection({})); // réinitialiser les checkbox
    }
  }, []);

  useEffect(() => {
    if (onPaginationResetRef) {
      onPaginationResetRef(() => {
        setPagination(prev => ({
          ...prev,
          pageIndex: 0,
        }));
      });
    }
  }, []);

  useEffect(() => {
    if (onPaginationInfoRef) {
      onPaginationInfoRef({
        getPagination: () => pagination,
      });
    }
  }, [pagination]);

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(dataCount / pagination.pageSize),
    manualPagination: true,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {table.getVisibleFlatColumns().map(column => (
                    <TableCell key={column.id} style={{ width: column.getSize() }}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  return (
    <div className='px-2'>
      <div className='py-4'>
        <DataTableViewOptions table={table} onAction={onAction} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('pages.dataTable.errors.no_data')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} dataCount={dataCount} />
      </div>
    </div>
  );
}
