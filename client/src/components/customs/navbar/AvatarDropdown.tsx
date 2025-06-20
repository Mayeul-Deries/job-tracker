import avatarfallback from '@/assets/avatarfallback.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/useLogout';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AvatarDropdown() {
  const { logout, loading } = useLogout();

  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Avatar className='h-8 w-8'>
            {/* <AvatarImage src={user.avatar } /> */}
            <AvatarFallback>
              <img src={avatarfallback} className='w-full h-full object-cover rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40'>
        <DropdownMenuLabel>{t('navbar.avatar.my_account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>{t('navbar.avatar.profile')}</DropdownMenuItem>
        <DropdownMenuItem onClick={logout} disabled={loading}>
          {t('navbar.avatar.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
