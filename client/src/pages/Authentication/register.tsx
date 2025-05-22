import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const Register = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerSchema = z
    .object({
      username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(25, { message: 'Username must be at most 25 characters long' })
        .regex(/^[^A-Z\s]+$/, {
          message: 'Username must not contain leading, trailing, middle spaces or uppercase letters',
        }),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z
        .string()
        .max(255, { message: 'Password must be at most 255 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/, {
          message:
            'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        }),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);

      const response = await axiosConfig.post('/auth/register', values);

      toast.success(response.data.message);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(register)} className='flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <h1 className='text-2xl font-bold'>Create an account</h1>
                  <p className='text-balance text-sm text-muted-foreground'>
                    Create a new account by filling out the form below
                  </p>
                </div>
                <div className='grid gap-6'>
                  <FormField
                    control={registerForm.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type='username' placeholder='example' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder='example@email.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder='******' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder='******' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full' disabled={loading}>
                    Register
                  </Button>
                </div>
              </form>
            </Form>
            <div className='flex flex-col mt-6 gap-6'>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 bg-background px-2 text-muted-foreground'>Or continue with</span>
              </div>
              <Button disabled variant='outline' className='w-full'>
                <FcGoogle />
                Connect with Google
              </Button>

              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link to='/auth/login' className='underline underline-offset-4'>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
