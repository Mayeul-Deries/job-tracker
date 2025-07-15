import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';

interface PasswordInputProps extends React.ComponentPropsWithoutRef<'input'> {}

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className='relative'>
      <Input {...props} type={show ? 'text' : 'password'} autoComplete='current-password' />
      <button
        type='button'
        tabIndex={-1}
        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
        onClick={() => setShow(v => !v)}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
