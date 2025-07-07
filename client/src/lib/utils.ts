import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Row } from '@tanstack/react-table';
import { t } from 'i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import i18n from './i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function customGlobalFilter<T>(row: Row<T>, columnId: string, filterValue: string) {
  const rawValue = row.getValue(columnId) ?? '';

  if (columnId === 'status') {
    const translatedStatus = translateStatus(String(rawValue));
    return translatedStatus.toLowerCase().includes(filterValue.toLowerCase());
  }

  if (columnId === 'category') {
    const translatedCategory = translateCategory(String(rawValue));
    return translatedCategory.toLowerCase().includes(filterValue.toLowerCase());
  }

  if (columnId === 'date') {
    const formatted = formatDateLocalized(String(rawValue));
    return normalize(formatted).includes(normalize(filterValue));
  }

  return String(rawValue).toLowerCase().includes(filterValue.toLowerCase());
}

// private functions
const localeMap = { en: enUS, fr };

function formatDateLocalized(dateStr: string): string {
  const date = new Date(dateStr);
  const lang = i18n.language.split('-')[0];
  const locale = localeMap[lang as keyof typeof localeMap] ?? enUS;

  return format(date, 'PPP', { locale });
}

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function translateStatus(status: string): string {
  const translatedStatus = t(`status.${status}`);
  return translatedStatus;
}

function translateCategory(category: string): string {
  const translatedCategory = t(`categories.${category}`);
  return translatedCategory;
}
