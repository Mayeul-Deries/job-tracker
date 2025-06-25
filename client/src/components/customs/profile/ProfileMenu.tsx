import { useState } from 'react';
import { FR, GB } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { getFullNamesOfLocales, listOfLocales } from '@/lib/i18n';
import { useLogout } from '@/hooks/useLogout';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { DeleteAccountForm } from './DeleteAccountForm';
import { ChevronRight, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const ProfileMenu = () => {
  const {
    i18n: { changeLanguage, language, t },
  } = useTranslation();

  const handleChangeLanguage = (l: string) => {
    localStorage.setItem('i18nextLng', l);
    changeLanguage(l);
    toast.success(t('navbar.locale_changer.locale_changed'));
  };

  const { logout, loading } = useLogout();

  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-58'>
          <DropdownMenuLabel>{t('pages.profile.form.button.actions.title')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenUpdatePasswordDialog(true)} className='flex justify-between'>
            {t('pages.profile.form.button.edit_password')}
            <ChevronRight className='text-black' />
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t('pages.profile.form.button.actions.change_language')}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {listOfLocales.map(l => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => handleChangeLanguage(l)}
                    className={` cursor-pointer flex items-center ${language === l ? 'bg-secondary' : ''}`}
                  >
                    {l === 'fr' && <FR />}
                    {l === 'en' && <GB />}
                    {getFullNamesOfLocales(l)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={logout} disabled={loading}>
            {t('navbar.avatar.logout')}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenDeleteAccountDialog(true)}
            className='text-red-500 focus:text-red-500 flex justify-between'
          >
            {t('pages.profile.delete_account.title')}
            <ChevronRight className='text-red-500' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openUpdatePasswordDialog} onOpenChange={setOpenUpdatePasswordDialog}>
        <UpdatePasswordForm setOpen={setOpenUpdatePasswordDialog} />
      </Dialog>

      <Dialog open={openDeleteAccountDialog} onOpenChange={setOpenDeleteAccountDialog}>
        <DeleteAccountForm setOpen={setOpenDeleteAccountDialog} />
      </Dialog>
    </>
  );
};
