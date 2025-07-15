import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import type { updateActionType } from '@/types/updateActionType';
import { Actions } from '@/constants/actions';

import { Button } from '@/components/ui/button';

interface DeleteJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  refreshAll?: (action: updateActionType) => void;
  jobApplication: JobApplication;
  resetPagination?: () => void;
}

export const DeleteJobApplicationForm = ({
  dialog,
  refresh,
  refreshAll,
  jobApplication,
  resetPagination,
}: DeleteJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onDeleteSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.delete(`/jobApplications/${jobApplication._id}`);
      toast.success(t(`toast.${response.data.translationKey}`));
      dialog(false);
      resetPagination?.();
      refresh();
      refreshAll?.({ type: Actions.DELETE, payload: jobApplication._id });
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 py-2'>
      <p className='text-sm text-muted-foreground text-center'>{t('pages.deleteJobApplication.description')}</p>

      <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
        <Button className='flex-1 min-w-[120px] cursor-pointer' onClick={() => dialog(false)} disabled={loading}>
          {t('pages.deleteJobApplication.button.cancel')}
        </Button>
        <Button
          className='bg-red-700 hover:bg-red-800 text-white flex-1 min-w-[120px] cursor-pointer'
          onClick={onDeleteSubmit}
          disabled={loading}
        >
          {t('pages.deleteJobApplication.button.confirm')}
        </Button>
      </div>
    </div>
  );
};
