import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      <h1 className='text-5xl font-bold mb-4'>404</h1>
      <p className='text-xl text-muted-foreground mb-6'>{t('pages.not_found.title')}</p>
      <Button asChild>
        <Link to='/'>{t('pages.not_found.button.back_to_home')}</Link>
      </Button>
    </div>
  );
}
