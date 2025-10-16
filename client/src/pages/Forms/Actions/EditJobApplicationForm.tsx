import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { getJobApplicationSchema } from '@/validations/schemas/jobApplication';
import type { updateActionType } from '@/types/updateActionType';
import { Actions } from '@/constants/actions';

import { Form } from '@/components/ui/form';
import { JobApplicationFormFields } from '../JobApplicationFormFields';

interface EditJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  refreshAll?: (action: updateActionType) => void;
  jobApplication: JobApplication;
  resetPagination?: () => void;
}

export const EditJobApplicationForm = ({
  dialog,
  refresh,
  refreshAll,
  jobApplication,
  resetPagination,
}: EditJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const editJobApplicationSchema = getJobApplicationSchema(t);

  const editJobApplicationForm = useForm<z.infer<typeof editJobApplicationSchema>>({
    resolver: zodResolver(editJobApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      title: jobApplication.title,
      company: jobApplication.company,
      location: jobApplication.location,
      date: jobApplication.date ? new Date(jobApplication.date) : new Date(),
      category: jobApplication.category,
      status: jobApplication.status,
      link: jobApplication.link,
      notes: jobApplication?.notes,
    },
  });

  const onEditSubmit: SubmitHandler<z.infer<typeof editJobApplicationSchema>> = async values => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/jobApplications/${jobApplication._id}`, values);
      toast.success(t(`toast.${response.data.translationKey}`));
      dialog(false);
      resetPagination?.();
      refresh();
      refreshAll?.({ type: Actions.EDIT, payload: response.data.jobApplication });
      editJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='overflow-y-auto px-2 sm:px-1 sm:ml-3 pt-2' style={{ maxHeight: 'calc(90vh - 5rem)' }}>
      <Form {...editJobApplicationForm}>
        <form onSubmit={editJobApplicationForm.handleSubmit(onEditSubmit)} className='flex flex-col gap-6'>
          <JobApplicationFormFields form={editJobApplicationForm} formKey={'editJobApplication'} loading={loading} />
        </form>
      </Form>
    </div>
  );
};
