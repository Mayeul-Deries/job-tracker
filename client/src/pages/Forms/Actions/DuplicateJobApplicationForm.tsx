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

interface DuplicateJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  jobApplication?: JobApplication;
}

export const DuplicateJobApplicationForm = ({ dialog, refresh, jobApplication }: DuplicateJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const duplicateJobApplicationSchema = getJobApplicationSchema(t);

  const duplicateJobApplicationForm = useForm<z.infer<typeof duplicateJobApplicationSchema>>({
    resolver: zodResolver(duplicateJobApplicationSchema),
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

  const onDuplicateSubmit: SubmitHandler<z.infer<typeof duplicateJobApplicationSchema>> = async values => {
    try {
      setLoading(true);
      const data = {
        ...values,
        date: values.date.toISOString(),
        withCreadentials: true,
      };
      const response = await axiosConfig.post('jobApplications', data);
      toast.success(t(`toast.${response.data.translationKey}`));
      dialog(false);
      refresh();
      duplicateJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...duplicateJobApplicationForm}>
      <form onSubmit={duplicateJobApplicationForm.handleSubmit(onDuplicateSubmit)} className='flex flex-col gap-6'>
        <JobApplicationFormFields
          form={duplicateJobApplicationForm}
          formKey='duplicateJobApplication'
          loading={loading}
        />
      </form>
    </Form>
  );
};
