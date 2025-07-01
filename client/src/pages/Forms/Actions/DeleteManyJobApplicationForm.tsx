import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';

import { Button } from '@/components/ui/button';

interface DeleteManyJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  resetSelection?: () => void;
  selectedJobApplications?: JobApplication[];
}

export const DeleteManyJobApplicationForm = ({
  dialog,
  refresh,
  resetSelection,
  selectedJobApplications,
}: DeleteManyJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onDeleteManySubmit = async () => {
    try {
      setLoading(true);
      const ids = selectedJobApplications?.map(app => app._id) || [];
      const response = await axiosConfig.delete('/jobApplications/batch', {
        data: { ids },
      });
      toast.success(response.data.deletedCount + ' ' + t(`toast.${response.data.translationKey}`));
      dialog(false);
      refresh();
      resetSelection?.();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 py-2'>
      <p className='text-sm text-muted-foreground text-center'>{t('pages.deleteManyJobApplications.description')}</p>

      <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
        <Button className='flex-1 min-w-[120px]' onClick={() => dialog(false)} disabled={loading}>
          {t('pages.deleteManyJobApplications.button.cancel')}
        </Button>
        <Button
          className='bg-red-700 hover:bg-red-800 text-white flex-1 min-w-[120px]'
          onClick={onDeleteManySubmit}
          disabled={loading}
        >
          {t('pages.deleteManyJobApplications.button.confirm')}
        </Button>
      </div>
    </div>
  );
};
