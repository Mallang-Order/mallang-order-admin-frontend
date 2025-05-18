import NavigationBar from '@/components/NavigationBar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-screen h-screen relative flex justify-center items-center bg-ml-bg-gray  text-black'>
      <NavigationBar />
      {children}
    </div>
  );
}
