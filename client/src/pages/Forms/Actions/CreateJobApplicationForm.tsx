import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { Categories, type CategoryType } from '@/constants/categories';
import { StatusOffer } from '@/constants/statusOffer';
import { useAuthContext } from '@/contexts/authContext';
import { getJobApplicationSchema } from '@/validations/schemas/jobApplication';

import { Form } from '@/components/ui/form';
import { JobApplicationFormFields } from '../JobApplicationFormFields';

interface CreateJobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
}

export const CreateJobApplicationForm = ({ dialog, refresh }: CreateJobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const { authenticatedUser } = useAuthContext();

  const createJobApplicationSchema = getJobApplicationSchema(t);

  const createJobApplicationForm = useForm<z.infer<typeof createJobApplicationSchema>>({
    resolver: zodResolver(createJobApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      company: '',
      city: '',
      date: new Date(),
      category: (authenticatedUser?.preferredCategory as CategoryType) ?? Categories.FULL_TIME,
      status: StatusOffer.SENT,
      link: '',
      notes: '',
    },
  });

  const onCreateSubmit: SubmitHandler<z.infer<typeof createJobApplicationSchema>> = async values => {
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
      createJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...createJobApplicationForm}>
      <form onSubmit={createJobApplicationForm.handleSubmit(onCreateSubmit)} className='flex flex-col gap-6'>
        <JobApplicationFormFields form={createJobApplicationForm} formKey={'createJobApplication'} loading={loading} />
      </form>
    </Form>
  );
};
