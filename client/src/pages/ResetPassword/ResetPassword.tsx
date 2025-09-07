import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getResetPasswordSchema } from '@/validations/schemas/user';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { PasswordInput } from '@/components/customs/PasswordInput';

export const ResetPassword = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const resetPasswordSchema = getResetPasswordSchema(t);

  const navigate = useNavigate();
  const location = useLocation();

  const token = location.state?.token;

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password', { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const setNewPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post(
        '/auth/reset-password',
        { newPassword: values.newPassword, newPasswordConfirm: values.newPasswordConfirm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(t(`toast.${response.data.translationKey}`));
      navigate('/auth/login');
    } catch (error: any) {
      if (error.response?.data?.translationKey === 'auth.error.reset_password.token_invalid') {
        toast.error(t(`toast.${error.response.data.translationKey}`));
        navigate('/forgot-password', { replace: true });
      } else {
        toast.error(t(`toast.${error.response.data.translationKey}`));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='absolute top-6 left-4 sm:left-8 right-4 sm:right-8'>
        <Button variant='link' className='cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowLeft /> {t('pages.reset_password.form.button.back')}
        </Button>
      </div>
      <div className='flex flex-col p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs sm:max-w-sm'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(setNewPassword)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>{t('pages.reset_password.form.title')}</h1>
                  <p className='text-sm text-muted-foreground'>{t('pages.reset_password.form.description')}</p>
                </div>

                <div className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.reset_password.form.label.new_password')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t('pages.reset_password.form.placeholder.new_password')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                        <FormDescription className='text-xs px-1 -mt-1 text-muted-foreground'>
                          {t('form.helper.password')}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='newPasswordConfirm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.reset_password.form.label.confirm_password')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t('pages.reset_password.form.placeholder.confirm_password')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type='submit' className='w-full cursor-pointer' disabled={loading}>
                  {t('pages.reset_password.form.button.submit')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
