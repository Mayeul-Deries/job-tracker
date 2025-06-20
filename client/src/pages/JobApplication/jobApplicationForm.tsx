import { useState } from 'react';
import type { JobApplication } from '@/interfaces/JobApplication';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { Categories } from '@/constants/categories';
import { StatusOffer } from '@/constants/statusOffer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/customs/table/DatePicker';
import { StatusSelect } from '@/components/customs/table/StatusSelect';
import { getJobApplicationSchema } from '@/validations/schemas/jobApplication';

interface JobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  action: string;
  jobApplication?: JobApplication;
  selectedJobApplications?: JobApplication[];
  resetSelection?: () => void;
}

export const JobApplicationForm = ({
  dialog,
  refresh,
  action,
  jobApplication,
  selectedJobApplications,
  resetSelection,
}: JobApplicationFormProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const createJobApplicationSchema = getJobApplicationSchema(t);
  const editJobApplicationSchema = getJobApplicationSchema(t);

  const createJobApplicationForm = useForm<z.infer<typeof createJobApplicationSchema>>({
    resolver: zodResolver(createJobApplicationSchema),
    defaultValues: {
      title: '',
      company: '',
      city: '',
      date: new Date(),
      category: Categories.APPRENTICESHIP,
      status: StatusOffer.SENT,
      link: '',
      notes: '',
    },
  });

  const editJobApplicationForm = useForm<z.infer<typeof editJobApplicationSchema>>({
    resolver: zodResolver(editJobApplicationSchema),
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

  const onCreateSubmit: SubmitHandler<z.infer<typeof createJobApplicationSchema>> = async values => {
    try {
      setLoading(true);
      const data = {
        ...values,
        date: values.date.toISOString(),
        withCreadentials: true,
      };
      const response = await axiosConfig.post('jobApplications', data);
      toast.success(response.data.message);
      dialog(false);
      refresh();
      // createJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit: SubmitHandler<z.infer<typeof editJobApplicationSchema>> = async values => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/jobApplications/${jobApplication?._id}`, values);
      toast.success(response.data.message);
      dialog(false);
      refresh();
      editJobApplicationForm.reset();
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.delete(`/jobApplications/${jobApplication?._id}`);
      toast.success(response.data.message);
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteManySubmit = async () => {
    try {
      setLoading(true);
      const ids = selectedJobApplications?.map(app => app._id) || [];
      const response = await axiosConfig.delete('/jobApplications/batch', {
        data: { ids },
      });
      toast.success(response.data.message);
      dialog(false);
      refresh();
      resetSelection?.();
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  if (action === 'create') {
    return (
      <Form {...createJobApplicationForm}>
        <form onSubmit={createJobApplicationForm.handleSubmit(onCreateSubmit)} className='flex flex-col gap-6'>
          <div className='grid gap-5 sm:gap-6'>
            <FormField
              control={createJobApplicationForm.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.createJobApplication.form.label.jobTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.createJobApplication.form.placeholder.jobTitle')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createJobApplicationForm.control}
              name='company'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.createJobApplication.form.label.companyName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.createJobApplication.form.placeholder.companyName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2 sm:gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={createJobApplicationForm.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.createJobApplication.form.label.city')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pages.createJobApplication.form.placeholder.city')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={createJobApplicationForm.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>{t('pages.createJobApplication.form.label.applicationDate')}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          variant='outline'
                          placeholder={t('pages.createJobApplication.form.placeholder.applicationDate')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex gap-2 sm:gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={createJobApplicationForm.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.createJobApplication.form.label.category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('pages.createJobApplication.form.placeholder.category')}>
                              {t(`categories.${field.value}`)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Categories).map(category => (
                            <SelectItem key={category} value={category}>
                              {t(`categories.${category}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={createJobApplicationForm.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.createJobApplication.form.label.status')}</FormLabel>
                      <FormControl>
                        <StatusSelect status={field.value} onStatusChange={field.onChange} variant='form' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={createJobApplicationForm.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.createJobApplication.form.label.link')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.createJobApplication.form.placeholder.link')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createJobApplicationForm.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.createJobApplication.form.label.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('pages.createJobApplication.form.placeholder.notes')}
                      className='h-[90px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-4'>
              <Button type='submit' className='w-full' disabled={loading}>
                {t('pages.createJobApplication.form.button.submit')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }

  if (action === 'edit') {
    return (
      <Form {...editJobApplicationForm}>
        <form onSubmit={editJobApplicationForm.handleSubmit(onEditSubmit)} className='flex flex-col gap-6'>
          <div className='grid gap-5 sm:gap-6'>
            <FormField
              control={editJobApplicationForm.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.editJobApplication.form.label.jobTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.editJobApplication.form.placeholder.jobTitle')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editJobApplicationForm.control}
              name='company'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.editJobApplication.form.label.companyName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.editJobApplication.form.placeholder.companyName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2 sm:gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={editJobApplicationForm.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.editJobApplication.form.label.city')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('pages.editJobApplication.form.placeholder.city')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={editJobApplicationForm.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>{t('pages.editJobApplication.form.label.applicationDate')}</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          variant='outline'
                          placeholder={t('pages.editJobApplication.form.placeholder.applicationDate')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex gap-2 sm:gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={editJobApplicationForm.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.editJobApplication.form.label.category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder={t('pages.editJobApplication.form.placeholder.category')}>
                              {t(`categories.${field.value}`)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Categories).map(category => (
                            <SelectItem key={category} value={category}>
                              {t(`categories.${category}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={editJobApplicationForm.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.editJobApplication.form.label.status')}</FormLabel>
                      <FormControl>
                        <StatusSelect status={field.value} onStatusChange={field.onChange} variant='form' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={editJobApplicationForm.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.editJobApplication.form.label.link')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('pages.editJobApplication.form.placeholder.link')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editJobApplicationForm.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pages.editJobApplication.form.label.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('pages.editJobApplication.form.placeholder.notes')}
                      className='h-[90px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-4'>
              <Button type='submit' className='w-full' disabled={loading}>
                {t('pages.editJobApplication.form.button.submit')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }

  if (action === 'delete') {
    return (
      <div className='flex flex-col gap-6 px-2 py-2'>
        <p className='text-sm text-muted-foreground text-center'>{t('pages.deleteJobApplication.description')}</p>

        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
          <Button className='flex-1 min-w-[120px]' onClick={() => dialog(false)} disabled={loading}>
            {t('pages.deleteJobApplication.button.cancel')}
          </Button>
          <Button
            className='bg-red-700 hover:bg-red-800 text-white flex-1 min-w-[120px]'
            onClick={onDeleteSubmit}
            disabled={loading}
          >
            {t('pages.deleteJobApplication.button.confirm')}
          </Button>
        </div>
      </div>
    );
  }

  if (action === 'deleteMany') {
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
  }

  return (
    <>
      <div className='flex h-full w-full items-center justify-center'>
        <span className='text-muted-foreground'>Forbbiden action</span>
      </div>
    </>
  );
};
