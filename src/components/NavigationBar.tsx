'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: '가게 관리', icon: 'dashboard' },

    { href: '/categories', label: '카테고리 관리', icon: 'Cate' },
    { href: '/menus', label: '메뉴 관리', icon: 'Menu' },
    { href: '/orders', label: '주문 관리', icon: 'Order' },
  ];

  return (
    <div className='w-[18%] rounded-r-[25px] text-white bg-ml-yellow h-full flex flex-col justify-between '>
      <ul className='flex flex-col gap-2 w-[84%] mx-auto mt-24'>
        {navItems.map(({ href, label, icon }) => {
          const isSelected = pathname === href;
          const imageSrc = `/${icon}${isSelected ? 'S' : ''}.svg`;
          return (
            <li
              key={href}
              className={`w-full p-4 rounded-2xl ${
                isSelected ? 'bg-[#e6eff3] text-[#333333]' : ''
              }`}
            >
              <Link href={href} className='flex items-center gap-2'>
                <Image src={imageSrc} alt={label} width={18} height={18} />
                <p>{label}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className='p-5'>Profile Placeholder</p>
    </div>
  );
}
