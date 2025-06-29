import { useEffect, useRef, useState } from 'react';
import jobtracker from '@/assets/jobtracker.png';
import { LogOut, Menu, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/hooks/useLogout';
import { useNavigate } from 'react-router-dom';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LocaleChanger } from './LocaleChanger';
import { AvatarDropdown } from './AvatarDropdown';

export function Navbar() {
  const { logout, loading } = useLogout();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <header className='fixed top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-screen-xl items-center justify-between pl-4 pr-2 sm:px-6 lg:px-8'>
        <img src={jobtracker} alt='Job Tracker Logo' className='h-6 w-auto' />
        <div className='hidden gap-4 md:flex'>
          <LocaleChanger />
          <AvatarDropdown />
        </div>

        <div className='md:hidden'>
          <Menu
            className='cursor-pointer mr-1 transition-transform duration-300 ease-in-out hover:scale-110'
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <div
        ref={menuRef}
        className={cn(
          'fixed top-0 right-0 z-40 h-screen w-3xs bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex flex-col'>
          <div className='flex justify-between items-center gap-2'>
            <LocaleChanger />
            <X
              className='cursor-pointer transition duration-200 ease-in-out hover:scale-110'
              onClick={() => setIsOpen(false)}
            />
          </div>
          <Separator className='mt-2 mb-4' />
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <User className='h-4' />
              <Button variant='link' className='p-2 cursor-pointer' onClick={() => navigate('/profile')}>
                {t('navbar.avatar.profile')}
              </Button>
            </div>
            <div className='flex items-center'>
              <LogOut className='h-4' />
              <Button variant='link' className='p-2 cursor-pointer' onClick={logout} disabled={loading}>
                {t('navbar.avatar.logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
