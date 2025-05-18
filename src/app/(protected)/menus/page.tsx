'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Menu {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

// Temporary mock data
const mockCategories: Category[] = [
  { id: '1', name: '커피' },
  { id: '2', name: '논커피' },
  { id: '3', name: '디저트' },
];

const mockMenus: Menu[] = [
  {
    id: '1',
    name: '아메리카노',
    price: 4500,
    categoryId: '1',
    imageUrl: '/coffee.jpg',
  },
  {
    id: '2',
    name: '카페라떼',
    price: 5000,
    categoryId: '1',
    imageUrl: '/latte.jpg',
  },
  {
    id: '3',
    name: '초코케이크',
    price: 6500,
    categoryId: '3',
    imageUrl: '/cake.jpg',
  },
];

export default function Menus() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMenus =
    selectedCategory === 'all'
      ? mockMenus
      : mockMenus.filter((menu) => menu.categoryId === selectedCategory);

  return (
    <div className='h-full flex-1 p-8 flex flex-col gap-[30px] overflow-y-scroll'>
      <div>
        <h1 className='text-[32px] inter-semibold'>메뉴 관리</h1>
        <h2 className='text-[16px] inter-medium text-ml-gray-dark'>
          Menu Management
        </h2>
      </div>

      <main className='flex flex-col gap-8 w-full'>
        {/* Add Menu Section */}
        <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
          <h3 className='text-[18px] inter-semibold'>메뉴 추가</h3>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-8'>
              <div className='flex flex-col gap-2 flex-1'>
                <label htmlFor='menu-name' className='inter-semibold'>
                  메뉴 이름
                </label>
                <input
                  id='menu-name'
                  type='text'
                  placeholder='메뉴 이름'
                  className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                />
              </div>
              <div className='flex flex-col gap-2 flex-1'>
                <label htmlFor='menu-price' className='inter-semibold'>
                  가격
                </label>
                <input
                  id='menu-price'
                  type='number'
                  placeholder='가격'
                  className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                />
              </div>
              <div className='flex flex-col gap-2 flex-1'>
                <label htmlFor='menu-category' className='inter-semibold'>
                  카테고리
                </label>
                <select
                  id='menu-category'
                  className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                >
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='menu-image' className='inter-semibold'>
                메뉴 이미지
              </label>
              <input
                id='menu-image'
                type='file'
                accept='image/*'
                className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
              />
            </div>
            <button className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px] mt-4'>
              <Image src='/Submit.svg' alt='add' width={16} height={16} />
              <span className='inter-regular'>메뉴 추가</span>
            </button>
          </div>
        </div>

        {/* Menu List Section */}
        <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
          <div className='flex justify-between items-center'>
            <h3 className='text-[18px] inter-semibold'>메뉴 목록</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='border border-ml-gray-dark rounded-xl p-2 focus:outline-0 focus:border-ml-yellow'
            >
              <option value='all'>전체 카테고리</option>
              {mockCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className='border border-ml-gray-dark rounded-2xl p-4 flex flex-col gap-2'
              >
                {menu.imageUrl && (
                  <div className='relative w-full h-48 rounded-xl overflow-hidden'>
                    <Image
                      src={menu.imageUrl}
                      alt={menu.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <h4 className='text-lg font-semibold'>{menu.name}</h4>
                <p className='font-semibold'>{menu.price.toLocaleString()}원</p>
                <p className='text-ml-gray-dark'>
                  {mockCategories.find((c) => c.id === menu.categoryId)?.name}
                </p>
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={() => setSelectedMenu(menu)}
                    className='flex-1 py-2 px-4 bg-ml-yellow text-white rounded-xl'
                  >
                    수정
                  </button>
                  <button className='flex-1 py-2 px-4 bg-red-500 text-white rounded-xl'>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Menu Modal */}
        {selectedMenu && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div className='bg-white rounded-3xl p-6 w-[600px]'>
              <h3 className='text-[18px] inter-semibold mb-6'>메뉴 수정</h3>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-8'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <label className='inter-semibold'>메뉴 이름</label>
                    <input
                      type='text'
                      defaultValue={selectedMenu.name}
                      className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                    />
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <label className='inter-semibold'>가격</label>
                    <input
                      type='number'
                      defaultValue={selectedMenu.price}
                      className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='inter-semibold'>카테고리</label>
                  <select
                    defaultValue={selectedMenu.categoryId}
                    className='border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                  >
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex gap-2 mt-4'>
                  <button
                    onClick={() => setSelectedMenu(null)}
                    className='flex-1 py-2 px-4 bg-gray-200 rounded-xl'
                  >
                    취소
                  </button>
                  <button className='flex-1 py-2 px-4 bg-ml-yellow text-white rounded-xl'>
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
