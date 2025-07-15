import { useTranslation } from 'react-i18next';
import { Actions, type ActionType } from '@/constants/actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HeaderProps {
  handleJobApplicationAction: (action: ActionType, data?: any) => void;
}
export const Header = ({ handleJobApplicationAction }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-col gap-4 sm:gap-24 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2 sm:gap-0'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>{t('pages.home.title')}</h1>
          <p className='text-gray-600 text-sm sm:text-base'>{t('pages.home.description')}</p>
        </div>
        <Button
          size='default'
          className='mt-2 sm:mt-0 w-full sm:w-auto'
          onClick={() => handleJobApplicationAction(Actions.CREATE)}
        >
          <Plus className='mr-2 h-5 w-5' />
          {t('pages.home.button.add_job_application')}
        </Button>
      </div>
    </div>
  );
};
