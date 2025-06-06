import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  variant?: 'outline' | 'ghost';
};

export const DatePicker = ({ value, onChange, placeholder, variant = 'outline' }: DatePickerProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const localeMap = { en: enUS, fr };
  const currentLocale = localeMap[lang as keyof typeof localeMap];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn('justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          {value ? (
            format(value, 'PPP', { locale: currentLocale })
          ) : (
            <span>{placeholder || t('pages.createJobApplication.form.placeholder.applicationDate')}</span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          disabled={date => date > new Date() || date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
