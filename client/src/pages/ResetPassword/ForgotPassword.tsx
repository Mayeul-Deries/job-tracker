import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getForgotPasswordSchema } from '@/validations/schemas/user';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgotPasswordSchema = getForgotPasswordSchema(t);

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const sendEmailOTP = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post('/auth/forgot-password', values);
      toast.success(t(`toast.${response.data.translationKey}`));
      navigate('/verify-reset-code', { state: { email: values.email } });
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='absolute top-6 left-4 sm:left-8 right-4 sm:right-8'>
        <Button variant='link' className='cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowLeft /> {t('pages.forgot_password.button.back')}
        </Button>
      </div>
      <div className='flex flex-col p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs sm:max-w-sm'>
            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(sendEmailOTP)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>{t('pages.forgot_password.title')}</h1>
                  <p className=' text-sm text-muted-foreground'>{t('pages.forgot_password.description')}</p>
                </div>

                <FormField
                  control={forgotPasswordForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.forgot_password.label.email')}</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder={t('pages.forgot_password.placeholder.email')} {...field} />
                      </FormControl>
                      <FormMessage className='text-xs -mt-1 px-1' />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full cursor-pointer' disabled={loading}>
                  {t('pages.forgot_password.button.submit')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
