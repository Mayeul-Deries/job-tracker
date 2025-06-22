import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import avatarfallback from '@/assets/avatarfallback.png';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { useAuthContext } from '@/contexts/authContext';
import { useTranslation } from 'react-i18next';
import { getUpdateUserSchema } from '@/validations/schemas/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authenticatedUser, setAuthenticatedUser } = useAuthContext();
  const { t } = useTranslation();

  const updateUserSchema = getUpdateUserSchema(t);

  const updateUserForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: authenticatedUser?.username,
      email: authenticatedUser?.email,
    },
  });

  const updateUser: SubmitHandler<z.infer<typeof updateUserSchema>> = async values => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/users/${authenticatedUser?._id}`, values);
      toast.success(t(`toast.${response.data.translationKey}`));
      setAuthenticatedUser(response.data.user);
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='flex flex-col p-6 md:p-10  max-h-screen overflow-y-auto'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                <Avatar className='w-22 h-22 sm:w-28 sm:h-28 '>
                  {/* <AvatarImage
                    src={authUser?.avatar}
                    alt='User Avatar'
                    className='object-cover object-center w-full h-full rounded-full'
                  /> */}
                  <AvatarFallback>
                    <img src={avatarfallback} className='w-full h-full object-center rounded-full' />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Form {...updateUserForm}>
              <form onSubmit={updateUserForm.handleSubmit(updateUser)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-10 text-center'>
                  <h1 className='text-2xl font-bold'>{authenticatedUser?.username}</h1>
                  <p className='text-balance text-sm text-muted-foreground'>{t('pages.profile.form.description')}</p>
                </div>
                <div className='grid gap-6'>
                  <FormField
                    control={updateUserForm.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.profile.form.label.username')}</FormLabel>
                        <FormControl>
                          <Input
                            type='username'
                            placeholder={t('pages.profile.form.placeholder.username')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateUserForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pages.profile.form.label.email')}</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder={t('pages.profile.form.placeholder.email')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full' disabled={loading}>
                    {t('pages.profile.form.button.confirm')}
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
