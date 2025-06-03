import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatusOffer } from '@/constants/statusOffer';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const StatusSelect = ({ value, onChange }: { value: keyof typeof statusLabels; onChange: (value: keyof typeof statusLabels) => void }) => {
  const statusColors: Record<string, string> = {
    [StatusOffer.SENT]: 'bg-blue-100 text-blue-700',
    [StatusOffer.FOLLOWED_UP]: 'bg-yellow-100 text-yellow-700',
    [StatusOffer.INTERVIEW_SCHEDULED]: 'bg-purple-100 text-purple-700',
    [StatusOffer.ACCEPTED]: 'bg-green-100 text-green-700',
    [StatusOffer.REJECTED]: 'bg-red-100 text-red-700',
  };

  const { t } = useTranslation();

  const statusLabels = {
    sent: t('status.sent'),
    followed_up: t('status.followed_up'),
    interview_scheduled: t('status.interview_scheduled'),
    accepted: t('status.accepted'),
    rejected: t('status.rejected'),
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-full'>
        <SelectValue>
          <Badge className={cn('px-2 py-1 rounded-sm', statusColors[value])}>{statusLabels[value]}</Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(StatusOffer).map(status => (
          <SelectItem key={status} value={status}>
            <div className={cn('flex items-center gap-2')}>
              <span className={cn('h-2 w-2 rounded-full', statusColors[status]?.replace('text-', 'bg-'))} />
              {status}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
