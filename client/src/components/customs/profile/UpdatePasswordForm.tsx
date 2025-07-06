import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { axiosConfig } from '@/config/axiosConfig';
import { useAuthContext } from '@/contexts/authContext';
import { getUpdatePasswordSchema } from '@/validations/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

interface UpdatePasswordProps {
  setOpen: (open: boolean) => void;
}

export const UpdatePasswordForm = ({ setOpen }: UpdatePasswordProps) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const { authenticatedUser } = useAuthContext();

  const updatePasswordSchema = getUpdatePasswordSchema(t);
  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const onUpdatePasswordSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/users/${authenticatedUser?._id}/password`, values);
      toast.success(t(`toast.${response.data.translationKey}`));
      setOpen(false);
      updatePasswordForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className='sm:max-w-[525px]'>
      <Form {...updatePasswordForm}>
        <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePasswordSubmit)} className='space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('pages.profile.password_changer.title')}</DialogTitle>
            <DialogDescription>{t('pages.profile.password_changer.description')}</DialogDescription>
          </DialogHeader>
          <FormField
            control={updatePasswordForm.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>{t('pages.profile.password_changer.label.current_password')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={t('pages.profile.password_changer.placeholder.current_password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs -mt-1 px-1' />
              </FormItem>
            )}
          />
          <FormField
            control={updatePasswordForm.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>{t('pages.profile.password_changer.label.new_password')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={t('pages.profile.password_changer.placeholder.new_password')}
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
            control={updatePasswordForm.control}
            name='newPasswordConfirm'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>{t('pages.profile.password_changer.label.new_password_confirm')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={t('pages.profile.password_changer.placeholder.new_password_confirm')}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs -mt-1 px-1' />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)} type='button'>
              {t('pages.profile.password_changer.button.cancel')}
            </Button>
            <Button disabled={loading} type='submit'>
              {t('pages.profile.password_changer.button.save')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
