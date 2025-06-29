import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface AvatarInputProps {
  src?: string;
  fallbackSrc?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function AvatarInput({ src, fallbackSrc, onChange, disabled = false, className = '' }: AvatarInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative group w-24 h-24 sm:w-24 sm:h-24 cursor-pointer',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <Avatar className='w-full h-full'>
        <AvatarImage src={src} alt='Avatar' className='object-cover object-center w-full h-full rounded-full' />
        <AvatarFallback>
          <img src={fallbackSrc} alt='Fallback Avatar' className='w-full h-full object-cover rounded-full' />
        </AvatarFallback>
      </Avatar>

      <div
        title={t('pages.profile.avatar_changer.title')}
        className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 opacity-75 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'
      >
        <Pencil className='w-5 h-5 text-white' />
      </div>

      <Input ref={inputRef} type='file' className='hidden' onChange={onChange} disabled={disabled} />
    </div>
  );
}
