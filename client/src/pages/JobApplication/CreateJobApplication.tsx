import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Categories } from '@/constants/categories';
import { StatusOffer } from '@/constants/statusOffer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/customs/DatePicker';
import { StatusSelect } from '@/components/customs/StatusSelect';

export const CreateJobApplication = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const createJobApplicationSchema = z.object({
    title: z.string().min(1, { message: t('pages.createJobApplication.errors.jobTitle_required') }),
    company: z.string().min(1, { message: t('pages.createJobApplication.errors.companyName_required') }),
    city: z.string().min(1, { message: t('pages.createJobApplication.errors.city_required') }),
    date: z.date({ required_error: t('pages.createJobApplication.errors.applicationDate_required') }),
    category: z.enum([
      Categories.INTERNSHIP,
      Categories.APPRENTICESHIP,
      Categories.FULL_TIME,
      Categories.PART_TIME,
      Categories.FREELANCE,
      Categories.CONTRACT,
      Categories.SEASONAL,
    ]),
    status: z.enum([
      StatusOffer.SENT,
      StatusOffer.FOLLOWED_UP,
      StatusOffer.INTERVIEW_SCHEDULED,
      StatusOffer.ACCEPTED,
      StatusOffer.REJECTED,
    ]),
    link: z.string().url(t('pages.createJobApplication.errors.link_invalid')).optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
  });

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

  async function createJobApplication(values: z.infer<typeof createJobApplicationSchema>) {
    try {
      setLoading(true);

      const data = {
        ...values,
        date: values.date.toISOString(),
        withCreadentials: true,
      };
      const response = await axiosConfig.post('jobApplications', data);

      toast.success(response.data.message);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='flex flex-col p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-lg'>
            <Form {...createJobApplicationForm}>
              <form
                onSubmit={createJobApplicationForm.handleSubmit(createJobApplication)}
                className='flex flex-col gap-6'
              >
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>{t('pages.createJobApplication.form.title')}</h1>
                  <p className='text-balance text-sm text-muted-foreground'>
                    {t('pages.createJobApplication.form.description')}
                  </p>
                </div>
                <div className='grid gap-6'>
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
                          <Input
                            placeholder={t('pages.createJobApplication.form.placeholder.companyName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex gap-4'>
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

                  <div className='flex gap-4'>
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
                              <StatusSelect status={field.value} onStatusChange={field.onChange} />
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
                            className='min-h-[100px] resize-none'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full' disabled={loading}>
                    {t('pages.createJobApplication.form.button.submit')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
