import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  loginName: z
    .string()
    .min(2, {message: 'Login is required'})
    .regex(/^[^A-Z\s]+$/, { message: "Spaces are forbidden" }),
  password: z.string()
    .min(1, 'Password is required')
    .max(255, { message: "Password cannot be longer than 255" }),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // const form = useForm<z.infer<typeof loginSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //   },
  // });

  async function login(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      const isEmail = /\S+@\S+\.\S+/.test(values.loginName);
      const data = {
        ...(isEmail ? { email: values.loginName } : { username: values.loginName }),
        password: values.password,
      }
      const response = await axiosConfig.post('/auth/login', data);

      toast.success(response.data.message);
      navigate("/");
    }
    catch (error: any) {
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      // Assuming an async login function
      console.log(values);
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    
  );
};
