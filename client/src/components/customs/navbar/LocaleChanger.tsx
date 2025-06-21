import { useTranslation } from 'react-i18next';
import { FR, GB } from 'country-flag-icons/react/3x2';

import { Globe } from 'lucide-react';
import { getFullNamesOfLocales, listOfLocales } from '@/lib/i18n';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';

export const LocaleChanger = () => {
  const {
    i18n: { changeLanguage, language, t },
  } = useTranslation();

  const handleChangeLanguage = (l: string) => {
    localStorage.setItem('i18nextLng', l);
    changeLanguage(l);
    toast.success(t('navbar.locale_changer.locale_changed'));
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className='cursor-pointer text-primary'>
        <Button title={t('navbar.locale_changer.title')} variant='ghost' className='rounded-full' size='icon'>
          <Globe className='w-5 h-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-32'>
        <DropdownMenuLabel>{t('navbar.locale_changer.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
