import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/contexts/authContext';
import { getLoginSchema } from '@/validations/schemas/user';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { setAuthenticatedUser } = useAuthContext();

  const loginSchema = getLoginSchema(t);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginName: '',
      password: '',
    },
  });

  async function login(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      const data = {
        loginName: values.loginName,
        password: values.password,
      };
      const response = await axiosConfig.post('/auth/login', data);

      toast.success(response.data.message);
      setAuthenticatedUser(response.data.user);
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
          <div className='w-full max-w-xs'>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(login)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>{t('pages.login.form.title')}</h1>
                  <p className='text-balance text-sm text-muted-foreground'>{t('pages.login.form.description')}</p>
                </div>
                <div className='grid gap-6'>
                  <FormField
                    control={loginForm.control}
                    name='loginName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.login.form.label.login')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('pages.login.form.placeholder.login')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.login.form.label.password')}</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder={t('pages.login.form.placeholder.password')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full' disabled={loading}>
                    {t('pages.login.form.button.login')}
                  </Button>
                </div>
              </form>
            </Form>
            <div className='flex flex-col mt-6 gap-6'>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                  {t('pages.login.form.text.or_continue_with')}
                </span>
              </div>
              <Button disabled variant='outline' className='w-full'>
                <FcGoogle />
                {t('pages.login.form.button.google')}
              </Button>

              <div className='text-center text-sm'>
                {t('pages.login.form.text.no_account')}{' '}
                <Link to='/auth/register' className='underline underline-offset-4'>
                  {t('pages.login.form.button.signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
