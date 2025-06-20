import jobtracker from '@/assets/jobtracker.png';
import { LocaleChanger } from './LocaleChanger';
import { AvatarDropdown } from './AvatarDropdown';

export function Navbar() {
  return (
    <header className='fixed top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <img src={jobtracker} alt='Job Tracker Logo' className='h-6 w-auto' />
        <div className='flex items-center justify-between gap-4'>
          <LocaleChanger />
          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
