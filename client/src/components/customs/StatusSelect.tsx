import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { StatusOffer } from '@/constants/statusOffer';

const statusOptions = [
  { value: StatusOffer.SENT, color: 'bg-blue-100 text-blue-700' },
  { value: StatusOffer.FOLLOWED_UP, color: 'bg-yellow-100 text-yellow-700' },
  { value: StatusOffer.INTERVIEW_SCHEDULED, color: 'bg-purple-100 text-purple-700' },
  { value: StatusOffer.ACCEPTED, color: 'bg-green-100 text-green-700' },
  { value: StatusOffer.REJECTED, color: 'bg-red-100 text-red-700' },
];

export const StatusSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { t } = useTranslation();

  const selectedOption = statusOptions.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-full'>
        <SelectValue>
          {selectedOption && (
            <Badge className={cn('px-2 py-1 rounded-sm', selectedOption.color)}>
              {t(`status.${selectedOption.value.toLowerCase().replace(' ', '_')}`)}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {t(`status.${option.value.toLowerCase().replace(' ', '_')}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
