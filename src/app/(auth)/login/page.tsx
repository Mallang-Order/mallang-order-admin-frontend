'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch('email');

  const handleClearEmail = () => {
    setValue('email', '');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { accessToken, refreshToken } = await response.json();

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Store tokens in cookies
      document.cookie = `accessToken=${accessToken}; path=/`;
      document.cookie = `refreshToken=${refreshToken}; path=/`;

      router.push('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error);
      toast('로그인에 실패했습니다');
    }
  };

  return (
    <div className='min-h-screen flex justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 mt-[86px]'>
      <div className=''>
        <div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-[40px] inter-bold font-bold text-gray-900'>
              Login
            </h2>
            <p className='inter-regular text-[15px] text-[#667085]'>
              로그인하고 효율적인 가게 관리를 시작해볼까요?
            </p>
          </div>
        </div>
        <form
          className='mt-10 gap-5 w-[360px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='rounded-md'>
            <div className='relative h-20'>
              <label htmlFor='email'>Email</label>
              <div className='relative'>
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  {...register('email')}
                  className={`appearance-none rounded-[8px] relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:border-ml-yellow focus:z-10 sm:text-sm `}
                  placeholder='youremail@example.com'
                />
                {email && (
                  <button
                    type='button'
                    onClick={handleClearEmail}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.email && (
                <p className='absolute bottom-0 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className='relative h-20'>
              <label htmlFor='password'>Password</label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  {...register('password')}
                  className={`appearance-none rounded-[8px] relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-ml-yellow focus:z-10 sm:text-sm`}
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 -translate-y-1/2 z-10 focus:ring-0'
                >
                  <Image
                    src={showPassword ? '/Hide.svg' : '/Show.svg'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {errors.password && (
                <p className='absolute bottom-0 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='hover:cursor-pointer mt-[18px] group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ml-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <Link
          href='/signup'
          className='font-medium text-ml-yellow w-[360px] flex justify-center mt-[18px]'
        >
          계정이 없으신가요? Sign up
        </Link>
      </div>
    </div>
  );
}
