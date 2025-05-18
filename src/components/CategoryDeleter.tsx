'use client';

import { Category } from '@/types/Category';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';
import Image from 'next/image';
import { useState } from 'react';

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory?: Category | null;
}

export default function CategoryNameChanger({
  categories,
}: CategoryDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  return (
    <div className='flex w-full gap-8'>
      <div className='flex flex-col  gap-2'>
        <DropdownMenu>
          <span className='inter-semibold'>삭제할 카테고리</span>
          <div className='flex gap-8 w-full'>
            <DropdownMenuTrigger className='  outline-0 w-[400px] border border-ml-gray-dark  text-black rounded-2xl flex'>
              <span className='inter-regular w-full p-4 text-left'>
                {selectedCategory?.category_name || 'Categories'}
              </span>
              <Image
                src='DownArrow.svg'
                alt='arrow-down'
                width={16}
                height={16}
                className='mx-4'
              />
            </DropdownMenuTrigger>
            <button className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px]'>
              <Image src='Submit.svg' alt='add' width={16} height={16} />
              <span className='inter-regular '>카테고리 삭제</span>
            </button>
          </div>

          <DropdownMenuContent className='w-[400px] left-0'>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem
                className='w-[400px] '
                key={category.category_id}
                onSelect={() => setSelectedCategory(category)}
              >
                {category.category_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
