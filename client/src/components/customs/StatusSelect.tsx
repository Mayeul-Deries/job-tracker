import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { StatusOffer } from '@/constants/statusOffer';

const statusOptions = [
  { value: StatusOffer.SENT, color: 'bg-blue-400' },
  { value: StatusOffer.FOLLOWED_UP, color: 'bg-yellow-400' },
  { value: StatusOffer.INTERVIEW_SCHEDULED, color: 'bg-purple-400' },
  { value: StatusOffer.ACCEPTED, color: 'bg-green-400' },
  { value: StatusOffer.REJECTED, color: 'bg-red-400' },
];

type StatusSelectProps = {
  value: string;
  onChange: (value: string) => void;
  withBorder?: boolean;
};

export const StatusSelect = ({ value, onChange, withBorder = true }: StatusSelectProps) => {
  const { t } = useTranslation();

  const selectedOption = statusOptions.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'w-full h-8',
          withBorder
            ? 'px-3 border bg-white rounded-md focus:ring-2 focus:ring-ring'
            : 'px-0 bg-transparent border-none shadow-none hover:bg-transparent focus:ring-0 focus:outline-none'
        )}
      >
        <SelectValue>
          <div className='flex items-center gap-2'>
            <span className={cn('w-2 h-2 rounded-full', selectedOption?.color)} />
            <span className='text-sm'>{t(`status.${selectedOption?.value.toLowerCase().replace(/ /g, '_')}`)}</span>
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <div className='flex items-center gap-2'>
              <span className={cn('w-2 h-2 rounded-full', option.color)} />
              {t(`status.${option.value.toLowerCase().replace(/ /g, '_')}`)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
