import { cn } from '@/lib/utils';
import { t } from 'i18next';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { StatusOffer } from '@/constants/statusOffer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StatusBadgeProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: StatusOffer.SENT, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-400' },
  { value: StatusOffer.FOLLOWED_UP, color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-400' },
  {
    value: StatusOffer.INTERVIEW_SCHEDULED,
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-400',
  },
  { value: StatusOffer.ACCEPTED, color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-400' },
  { value: StatusOffer.REJECTED, color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-400' },
];

export const StatusSelect = ({ status, onStatusChange }: StatusBadgeProps) => {
  const currentStatus = statusOptions.find(opt => opt.value === status);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-between px-3 py-2 rounded-md text-sm border-solid border-1 shadow-xs',
            currentStatus?.color
          )}
        >
          {t(`status.${status.toLowerCase().replace(/ /g, '_')}`)}
          <ChevronDownIcon className='h-4 w-4' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[248px] p-1'>
        <div className='space-y-1'>
          {statusOptions.map(option => (
            <button
              key={option.value}
              className={cn(
                'flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-sm',
                option.value === status ? option.color : 'hover:bg-gray-100'
              )}
              onClick={() => onStatusChange(option.value)}
            >
              {t(`status.${option.value.toLowerCase().replace(/ /g, '_')}`)}
              {option.value === status && <CheckIcon className='h-4 w-4' />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
