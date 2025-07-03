import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { getJobApplicationSchema } from '@/validations/schemas/jobApplication';

import { Form } from '@/components/ui/form';
import { JobApplicationFormFields } from '../JobApplicationFormFields';

interface EditJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  jobApplication?: JobApplication;
}

export const EditJobApplicationForm = ({ dialog, refresh, jobApplication }: EditJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const editJobApplicationSchema = getJobApplicationSchema(t);

  const editJobApplicationForm = useForm<z.infer<typeof editJobApplicationSchema>>({
    resolver: zodResolver(editJobApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      title: jobApplication?.title,
      company: jobApplication?.company,
      city: jobApplication?.city,
      date: jobApplication?.date ? new Date(jobApplication.date) : new Date(),
      category: jobApplication?.category,
      status: jobApplication?.status,
      link: jobApplication?.link,
      notes: jobApplication?.notes,
    },
  });

  const onEditSubmit: SubmitHandler<z.infer<typeof editJobApplicationSchema>> = async values => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/jobApplications/${jobApplication?._id}`, values);
      toast.success(t(`toast.${response.data.translationKey}`));
      dialog(false);
      refresh();
      editJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...editJobApplicationForm}>
      <form onSubmit={editJobApplicationForm.handleSubmit(onEditSubmit)} className='flex flex-col gap-6'>
        <JobApplicationFormFields form={editJobApplicationForm} formKey={'editJobApplication'} loading={loading} />
      </form>
    </Form>
  );
};
