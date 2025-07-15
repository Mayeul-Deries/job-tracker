import avatarfallback from '@/assets/avatarfallback.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/useLogout';
import { useAuthContext } from '@/contexts/authContext';

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

  const { authenticatedUser } = useAuthContext();

  const navigate = useNavigate();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Avatar className='h-8 w-8 cursor-pointer'>
            <AvatarImage src={authenticatedUser?.avatar} />
            <AvatarFallback>
              <img src={avatarfallback} className='w-full h-full object-cover rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40'>
        <DropdownMenuLabel>{t('navbar.avatar.my_account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={() => navigate('/profile')}>
          {t('navbar.avatar.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={logout} disabled={loading}>
          {t('navbar.avatar.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
