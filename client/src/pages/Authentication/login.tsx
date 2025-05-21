import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginSchema = z.object({
    loginName: z
      .string()
      .min(2, { message: 'Login is required' })
      .regex(/^[^A-Z\s]+$/, { message: 'Spaces are forbidden' }),
    password: z.string().min(1, 'Password is required').max(255, { message: 'Password cannot be longer than 255' }),
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginName: '',
      password: '',
    },
  });

  async function login(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      const isEmail = /\S+@\S+\.\S+/.test(values.loginName);
      const data = {
        ...(isEmail ? { email: values.loginName } : { username: values.loginName }),
        password: values.password,
      };
      const response = await axiosConfig.post('/auth/login', data);

      toast.success(response.data.message);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <form onSubmit={loginForm.handleSubmit(login)} className='flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Login to your account</h1>
                <p className='text-balance text-sm text-muted-foreground'>
                  Enter your email below to login to your account
                </p>
              </div>
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' placeholder='email@example.com' required />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <a href='#' className='ml-auto text-sm underline-offset-4 hover:underline'>
                      Forgot your password?
                    </a>
                  </div>
                  <Input id='password' type='password' placeholder='******' required />
                </div>
                <Button type='submit' className='w-full'>
                  Login
                </Button>
                <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>Or continue with</span>
                </div>
                <Button variant='outline' className='w-full'>
                  <FcGoogle />
                  Login with Google
                </Button>
              </div>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <a href='#' className='underline underline-offset-4'>
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
