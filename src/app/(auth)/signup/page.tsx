'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const signUpSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  storeName: z.string().min(1, 'Store name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isStoreNameChecked, setIsStoreNameChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const email = watch('email');
  const storeName = watch('storeName');
  const name = watch('name');

  const handleEmailVerification = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/emailSend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error('이메일 인증번호 발송에 실패했습니다.');
      }

      setShowVerificationInput(true);
      toast('인증번호가 전송되었습니다');
    } catch (error) {
      console.error('Email verification failed:', error);
      toast('이메일 인증번호 발송에 실패했습니다');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/emailCheck`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            authNum: verificationCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('인증번호가 일치하지 않습니다.');
      }

      setIsEmailVerified(true);
      setShowVerificationInput(false);
      toast('이메일 인증에 성공했습니다.');
    } catch (error) {
      console.error('Code verification failed:', error);
      toast('인증번호 확인에 실패했습니다');
    }
  };

  const handleStoreNameCheck = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/checkStoreName`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adminName: storeName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('이미 사용중인 가게 이름입니다.');
      }

      setIsStoreNameChecked(true);
      toast('사용 가능한 가게 이름입니다.');
    } catch (error) {
      console.error('Store name check failed:', error);
      toast('가게 이름 중복 확인에 실패했습니다.');
    }
  };

  const handleClearName = () => {
    setValue('name', '');
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (!isEmailVerified) {
      toast('이메일 인증이 필요합니다.');
      return;
    }
    if (!isStoreNameChecked) {
      toast('가게 이름 중복 확인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            adminName: data.name,
            storeName: data.storeName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      toast('회원가입이 완료되었습니다.');
      router.push('/login');
    } catch (error: any) {
      console.error('Sign-up failed:', error);
      toast(error.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className='min-h-screen flex justify-center bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className=''>
        <div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-[40px] inter-bold font-bold text-gray-900'>
              Sign up
            </h2>
            <p className='inter-regular text-[15px] text-[#667085]'>
              말랑오더에 가입하고 효율적인 가게 관리를 시작해볼까요?
            </p>
          </div>
        </div>
        <form className='mt-2 w-[360px]' onSubmit={handleSubmit(onSubmit)}>
          {/* 이름 */}
          <div className='flex flex-col mb-4'>
            <label htmlFor='name'>Your Name</label>
            <div className='relative'>
              <input
                id='name'
                type='text'
                {...register('name')}
                className={`appearance-none rounded-[8px] block w-full px-3 py-2 border ${
                  errors.name ? 'border-indigo-600' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:border-indigo-600 sm:text-sm`}
                placeholder='김말랑'
              />
              {name && (
                <button
                  type='button'
                  onClick={handleClearName}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10'
                >
                  ✕
                </button>
              )}
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-indigo-600'>{errors.name.message}</p>
            )}
          </div>

          {/* 가게 이름 */}
          {/* 스토어네임 부분만 수정 */}
          <div className='flex flex-col mb-4'>
            <label htmlFor='storeName'>Store Name</label>
            <div className='flex gap-3 items-center'>
              <input
                id='storeName'
                type='text'
                {...register('storeName')}
                className={`appearance-none rounded-[8px] block w-full px-3 py-2 border ${
                  errors.storeName ? 'border-indigo-600' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:border-indigo-600 sm:text-sm`}
                placeholder='Store Name'
                style={{ minHeight: '38px' }}  // 높이 고정으로 줄임 (원하는 높이로 조절 가능)
              />
              <button
                type='button'
                onClick={handleStoreNameCheck}
                disabled={!storeName || isStoreNameChecked}
                className='border border-indigo-600 rounded-[8px] px-4 py-1.5 font-normal text-indigo-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
                style={{ height: '38px' }}  // 버튼 높이도 인풋과 맞춤
              >
                {isStoreNameChecked ? '확인완료' : '중복확인'}
              </button>
            </div>
            {errors.storeName && (
              <p className='mt-1 text-sm text-indigo-600'>{errors.storeName.message}</p>
            )}
          </div>


          {/* 이메일 */}
          <div className='flex flex-col mb-4'>
            <label htmlFor='email'>Email</label>
            <div className='flex gap-3'>
              <input
                id='email'
                type='email'
                autoComplete='email'
                {...register('email')}
                className={`appearance-none rounded-[8px] block w-full px-3 py-2 border ${
                  errors.email ? 'border-indigo-600' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:border-indigo-600 sm:text-sm`}
                placeholder='youremail@example.com'
              />
              <button
                type='button'
                onClick={handleEmailVerification}
                disabled={!email || isEmailVerified}
                className='border border-indigo-600 rounded-[8px] px-4 py-2 font-normal text-indigo-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
              >
                {isEmailVerified ? '인증완료' : '인증하기'}
              </button>
            </div>
            {errors.email && (
              <p className='mt-1 text-sm text-indigo-600'>{errors.email.message}</p>
            )}
          </div>

          {/* 인증번호 입력 */}
          <div className='flex flex-col mb-4'>
            <label htmlFor='verificationCode'>Verification Code</label>
            <div className='flex gap-3'>
              <input
                id='verificationCode'
                disabled={!showVerificationInput}
                type='text'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className='appearance-none rounded-[8px] block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-indigo-600 sm:text-sm disabled:placeholder-indigo-300 disabled:cursor-not-allowed'
                placeholder='인증번호 6자리를 입력해주세요'
              />
              <button
                type='button'
                onClick={handleVerifyCode}
                disabled={!showVerificationInput}
                className='border border-indigo-600 rounded-[8px] px-4 py-2 font-normal text-indigo-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
              >
                확인
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className='flex flex-col mb-4'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              autoComplete='new-password'
              {...register('password')}
              className={`appearance-none rounded-[8px] block w-full px-3 py-2 border ${
                errors.password ? 'border-indigo-600' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:border-indigo-600 sm:text-sm`}
              placeholder='영문, 숫자, 하나 이상의 특수문자를 포함하는 8 ~ 16자'
            />
            {errors.password && (
              <p className='mt-1 text-sm text-indigo-600'>{errors.password.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <Link
          href='/login'
          className='font-medium text-indigo-600 w-[360px] flex justify-center mt-[18px]'
        >
          이미 회원이신가요? Login
        </Link>
      </div>
    </div>
  );
}
