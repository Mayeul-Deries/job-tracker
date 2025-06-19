import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className='fixed top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <h1 className='text-xl font-semibold tracking-tight'>Job Tracker</h1>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm'>
            Action
          </Button>
        </div>
      </div>
    </header>
  );
}
