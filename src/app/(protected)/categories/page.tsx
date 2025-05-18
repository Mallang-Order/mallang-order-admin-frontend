import CategoryDeleter from '@/components/CategoryDeleter';
import CategoryNameChanger from '@/components/CategoryNameChanger';
import { mockCategories } from '@/mocks/mockCategory';
import Image from 'next/image';

export default function Categories() {
  return (
    <div className='h-full flex-1 p-8 flex flex-col gap-[30px] overflow-y-scroll'>
      <div>
        <h1 className='text-[32px] inter-semibold'>카테고리 관리</h1>
        <h2 className='text-[16px] inter-medium text-ml-gray-dark'>
          Category Management
        </h2>
      </div>
      <main className='flex flex-col gap-8 w-full'>
        <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
          <h3 className='text-[18px] inter-semibold'>카테고리 추가</h3>
          <div className='flex gap-4 w-full'>
            <div className='flex flex-col  gap-2'>
              <label htmlFor='category-name' className='inter-semibold'>
                카테고리 이름
              </label>
              <div className='flex gap-8 w-full'>
                <input
                  id='category-name'
                  type='text'
                  placeholder='카테고리 이름'
                  className='w-[400px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                />
                <button className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px]'>
                  <Image src='Submit.svg' alt='add' width={16} height={16} />
                  <span className='inter-regular '>카테고리 추가</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
          <h3 className='text-[18px] inter-semibold'>카테고리 수정</h3>
          <div className='flex gap-4 w-full'>
            <CategoryNameChanger categories={mockCategories} />
          </div>
        </div>

        <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
          <h3 className='text-[18px] inter-semibold'>카테고리 삭제</h3>
          <div className='flex gap-4 w-full'>
            <CategoryDeleter categories={mockCategories} />
          </div>
        </div>
      </main>
    </div>
  );
}
