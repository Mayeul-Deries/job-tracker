import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Categories } from '@/constants/categories';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/customs/table/DatePicker';
import { StatusSelect } from '@/components/customs/table/StatusSelect';

interface JobApplicationFormFieldsProps {
  form: ReturnType<typeof useForm<any>>;
  formKey: string;
  loading: boolean;
}

export const JobApplicationFormFields = ({ form, formKey, loading }: JobApplicationFormFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className='grid gap-5 sm:gap-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`pages.${formKey}.form.label.jobTitle`)}</FormLabel>
              <FormControl>
                <Input placeholder={t(`pages.${formKey}.form.placeholder.jobTitle`)} {...field} />
              </FormControl>
              <FormMessage className='text-xs -mt-1 px-1' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='company'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`pages.${formKey}.form.label.companyName`)}</FormLabel>
              <FormControl>
                <Input placeholder={t(`pages.${formKey}.form.placeholder.companyName`)} {...field} />
              </FormControl>
              <FormMessage className='text-xs -mt-1 px-1' />
            </FormItem>
          )}
        />

        <div className='flex gap-2 sm:gap-4'>
          <div className='w-1/2'>
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`pages.${formKey}.form.label.city`)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(`pages.${formKey}.form.placeholder.city`)} {...field} />
                  </FormControl>
                  <FormMessage className='text-xs -mt-1 px-1' />
                </FormItem>
              )}
            />
          </div>
          <div className='w-1/2'>
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>{t(`pages.${formKey}.form.label.applicationDate`)}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      variant='outline'
                      placeholder={t(`pages.${formKey}.form.placeholder.applicationDate`)}
                    />
                  </FormControl>
                  <FormMessage className='text-xs -mt-1 px-1' />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex gap-2 sm:gap-4'>
          <div className='w-1/2'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`pages.${formKey}.form.label.category`)}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full cursor-pointer'>
                        <SelectValue placeholder={t(`pages.${formKey}.form.placeholder.category`)}>
                          {t(`categories.${field.value}`)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Categories).map(category => (
                        <SelectItem className='cursor-pointer' key={category} value={category}>
                          {t(`categories.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs -mt-1 px-1' />
                </FormItem>
              )}
            />
          </div>
          <div className='w-1/2'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`pages.${formKey}.form.label.status`)}</FormLabel>
                  <FormControl>
                    <StatusSelect status={field.value} onStatusChange={field.onChange} variant='form' />
                  </FormControl>
                  <FormMessage className='text-xs -mt-1 px-1' />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`pages.${formKey}.form.label.link`)}</FormLabel>
              <FormControl>
                <Input placeholder={t(`pages.${formKey}.form.placeholder.link`)} {...field} />
              </FormControl>
              <FormMessage className='text-xs -mt-1 px-1' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`pages.${formKey}.form.label.notes`)}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(`pages.${formKey}.form.placeholder.notes`)}
                  className='h-[90px] resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs -mt-1 px-1' />
            </FormItem>
          )}
        />

        <div className='flex flex-col gap-4'>
          <Button type='submit' className='w-full cursor-pointer' disabled={loading}>
            {t(`pages.${formKey}.form.button.submit`)}
          </Button>
        </div>
      </div>
    </>
  );
};
