import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import avatarfallback from '@/assets/avatarfallback.png';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useAuthContext } from '@/contexts/authContext';
import { useTranslation } from 'react-i18next';
import { Categories } from '@/constants/categories';
import { getUpdateUserSchema } from '@/validations/schemas/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AvatarInput } from '@/components/customs/profile/AvatarInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileMenu } from '@/components/customs/profile/ProfileMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authenticatedUser, setAuthenticatedUser } = useAuthContext();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const updateUserSchema = getUpdateUserSchema(t);

  const updateUserForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: authenticatedUser?.username,
      email: authenticatedUser?.email,
      preferredCategory: authenticatedUser?.preferredCategory ?? undefined,
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

  const updateProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = e.target.files?.[0];

    if (!file) {
      toast.error(t('toast.user.error.update_avatar.no_file'));
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axiosConfig.put(`/users/${authenticatedUser?._id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      <div className='absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex justify-between items-center sm:px-6'>
        <Button variant='link' className='cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowLeft /> {t('pages.profile.button.back_to_home')}
        </Button>
        <ProfileMenu />
      </div>

      <div className='flex flex-col py-24 md:py-20 max-h-screen overflow-y-auto'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <div className='flex flex-col items-center gap-4'>
              <AvatarInput
                src={authenticatedUser?.avatar}
                fallbackSrc={avatarfallback}
                onChange={updateProfilePic}
                disabled={loading}
              />
            </div>
            <Form {...updateUserForm}>
              <form onSubmit={updateUserForm.handleSubmit(updateUser)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-6 text-center'>
                  <p className='pt-2 text-balance text-sm text-muted-foreground'>
                    {t('pages.profile.form.label.change_picture')}
                  </p>
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

                  <FormField
                    control={updateUserForm.control}
                    name='preferredCategory'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center gap-2'>
                          <FormLabel>{t('pages.profile.form.label.preferred_category')}</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className='w-4 h-4 text-gray-400' />
                              </TooltipTrigger>
                              <TooltipContent side='right'>
                                <p>{t('pages.profile.form.tooltip.preferred_category')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder={t('pages.profile.form.placeholder.preferred_category')} />
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
