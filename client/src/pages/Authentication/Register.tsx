import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/authContext';
import { useTranslation } from 'react-i18next';
import { getRegisterSchema } from '@/validations/schemas/user';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/customs/PasswordInput';

export const Register = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setAuthenticatedUser } = useAuthContext();

  const registerSchema = getRegisterSchema(t);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);

      const response = await axiosConfig.post('/auth/register', values);

      toast.success(t(`toast.${response.data.translationKey}`));
      setAuthenticatedUser(response.data.user);
      localStorage.setItem('__jt_token', response.data.accessToken);
      navigate('/');
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='flex flex-col p-6 md:p-10 max-h-screen overflow-y-auto'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs sm:max-w-sm py-6'>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(register)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>{t('pages.register.form.title')}</h1>
                  <p className='text-balance text-sm text-muted-foreground'>{t('pages.register.form.description')}</p>
                </div>
                <div className='grid gap-6'>
                  <FormField
                    control={registerForm.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.register.form.label.username')}</FormLabel>
                        <FormControl>
                          <Input
                            type='username'
                            placeholder={t('pages.register.form.placeholder.username')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                        <FormDescription className='text-xs px-1 -mt-1 text-muted-foreground'>
                          {t('form.helper.username')}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.register.form.label.email')}</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder={t('pages.register.form.placeholder.email')} {...field} />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.register.form.label.password')}</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder={t('pages.register.form.placeholder.password')} {...field} />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                        <FormDescription className='text-xs px-1 -mt-1 text-muted-foreground'>
                          {t('form.helper.password')}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.register.form.label.confirmPassword')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t('pages.register.form.placeholder.confirmPassword')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs -mt-1 px-1' />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full cursor-pointer' disabled={loading}>
                    {t('pages.register.form.button.register')}
                  </Button>
                </div>
              </form>
            </Form>
            <div className='flex flex-col mt-6 gap-6'>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                  {t('pages.register.form.text.or_continue_with')}
                </span>
              </div>
              <Button disabled variant='outline' className='w-full cursor-pointer'>
                <FcGoogle />
                {t('pages.register.form.button.google')}
              </Button>

              <div className='text-center text-sm'>
                {t('pages.register.form.text.no_account')}{' '}
                <Link to='/auth/login' className='underline underline-offset-4'>
                  {t('pages.register.form.button.login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
