import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { axiosConfig } from '@/config/axiosConfig';
import { getDeleteUserSchema } from '@/validations/schemas/user';
import { useAuthContext } from '@/contexts/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';

interface DeleteAccountProps {
  setOpen: (open: boolean) => void;
}

export const DeleteAccountForm = ({ setOpen }: DeleteAccountProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const deleteAccountSchema = getDeleteUserSchema(t);
  const deleteUserForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      checkApproval: false,
    },
  });

  const onDeleteAccountSubmit = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.delete(`/users/${authenticatedUser?._id}`);
      toast.success(t(`toast.${response.data.translationKey}`));
      setAuthenticatedUser(null);
      navigate('/login');
      deleteUserForm.reset();
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    deleteUserForm.reset();
    setOpen(false);
  };

  return (
    <DialogContent className='sm:max-w-[525px]'>
      <Form {...deleteUserForm}>
        <form onSubmit={deleteUserForm.handleSubmit(onDeleteAccountSubmit)} className='space-y-6'>
          <DialogHeader>
            <DialogTitle>{t('pages.profile.delete_account.title')}</DialogTitle>
            <DialogDescription className='sr-only'>{t('pages.profile.delete_account.description')}</DialogDescription>
          </DialogHeader>
          <FormField
            control={deleteUserForm.control}
            name='checkApproval'
            render={({ field }) => (
              <FormItem className='flex items-start space-x-2 mt-4'>
                <FormControl>
                  <Checkbox
                    id='check-approval'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-[2px] border-gray-500 cursor-pointer'
                  />
                </FormControl>
                <div className='space-y-1'>
                  <FormLabel htmlFor='check-approval' className='font-normal text-sm leading-snug !text-gray-500'>
                    {t('pages.profile.delete_account.checkbox')}{' '}
                  </FormLabel>
                  <FormMessage className='text-xs' />
                </div>
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button className='cursor-pointer' variant='outline' onClick={handleCancel} type='button'>
              {t('pages.profile.delete_account.button.cancel')}
            </Button>
            <Button disabled={loading} className='cursor-pointer bg-red-700 hover:bg-red-800 text-white' type='submit'>
              {t('pages.profile.delete_account.button.confirm')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
