import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-screen h-screen relative flex justify-center items-center py-10 px-50 bg-white text-black'>
      <h1 className='absolute top-[22px] left-[44px] barlow-600 font-semibold text-[28px] '>
        Mallang Order
      </h1>
      <div className=' flex gap-[300px] h-full'>
        {children}
        <div className='w-[483px] h-[483px] relative mt-[67px]'>
          <Image src='/logoT.png' alt='mallang order logo' fill />
        </div>
      </div>
    </div>
  );
}
