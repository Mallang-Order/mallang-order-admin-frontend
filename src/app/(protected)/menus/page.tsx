'use client';

import Image from 'next/image';
import { useState, useEffect, FormEvent } from 'react';
import { fetchWithToken } from '@/utils/fetchWithToken';
import { toast } from 'sonner';

interface Menu {
  menuId: number;
  menuName: string;
  menuPrice: number;
  imageUrl?: string;
  adminId: number;
  categories: {
    categoryId: number;
    categoryName: string;
  }[];
}

interface Category {
  categoryId: number;
  categoryName: string;
}

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0은 Default(전체) 카테고리
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuCategory, setMenuCategory] = useState('');
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [updateImage, setUpdateImage] = useState<File | null>(null);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/menus`
      );
      if (!response.ok) throw new Error('Failed to fetch menus');
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      toast.error('메뉴 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`
      );
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      const filteredCategories = data.filter(
        (cat: Category) => cat.categoryName !== 'Default'
      );
      setCategories(filteredCategories);
      if (filteredCategories.length > 0)
        setMenuCategory(filteredCategories[0].categoryId.toString());
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('카테고리 목록을 불러오는데 실패했습니다');
    }
  };

  const handleAddMenu = async (e: FormEvent) => {
    e.preventDefault();
    if (!menuName || !menuPrice || !menuCategory || !menuImage) {
      toast.error('모든 필드를 입력해주세요');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('menuName', menuName);
    formData.append('menuPrice', menuPrice);
    formData.append('categoryIds', menuCategory);
    formData.append('image', menuImage);

    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu`,
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary
        }
      );

      if (!response.ok) throw new Error('Failed to add menu');

      toast.success('메뉴가 추가되었습니다');
      setMenuName('');
      setMenuPrice('');
      setMenuImage(null);
      fetchMenus();
    } catch (error) {
      console.error('Failed to add menu:', error);
      toast.error('메뉴 추가에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMenu = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('menuName', selectedMenu.menuName);
    formData.append('menuPrice', selectedMenu.menuPrice.toString());
    formData.append(
      'categoryIds',
      selectedMenu.categories[0]?.categoryId.toString() || ''
    );
    if (updateImage) {
      formData.append('image', updateImage);
    }

    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${selectedMenu.menuId}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to update menu');

      toast.success('메뉴가 수정되었습니다');
      setSelectedMenu(null);
      setUpdateImage(null);
      fetchMenus();
    } catch (error) {
      console.error('Failed to update menu:', error);
      toast.error('메뉴 수정에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;

    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${menuId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete menu');

      toast.success('메뉴가 삭제되었습니다');
      fetchMenus();
    } catch (error) {
      console.error('Failed to delete menu:', error);
      toast.error('메뉴 삭제에 실패했습니다');
    }
  };

  const filteredMenus =
    selectedCategory === 0
      ? menus
      : menus.filter((menu) =>
          menu.categories.some((cat) => cat.categoryId === selectedCategory)
        );

  return (
      <div className='h-full flex-1 p-8 flex flex-col gap-[30px] overflow-y-scroll'>
        <div>
          <h1 className='text-[32px] inter-semibold'>메뉴 관리</h1>
          <h2 className='text-[16px] inter-medium text-indigo-400'>
            Menu Management
          </h2>
        </div>

        <main className='flex flex-col gap-8 w-full'>
          {/* Add Menu Section */}
          <form
            onSubmit={handleAddMenu}
            className='bg-white rounded-3xl p-6 flex flex-col gap-8'
          >
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
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder='메뉴 이름'
                    className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                  />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor='menu-price' className='inter-semibold'>
                    가격
                  </label>
                  <input
                    id='menu-price'
                    type='number'
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    placeholder='가격'
                    className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                  />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor='menu-category' className='inter-semibold'>
                    카테고리
                  </label>
                  <select
                    id='menu-category'
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                  >
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
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
                  onChange={(e) => setMenuImage(e.target.files?.[0] || null)}
                  className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                />
              </div>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center justify-center gap-2 rounded-2xl hover:cursor-pointer bg-indigo-600 text-white p-4 w-[200px] mt-4 disabled:opacity-50'
              >
                <Image src='/Submit.svg' alt='add' width={16} height={16} />
                <span className='inter-regular'>
                  {submitting ? '처리중...' : '메뉴 추가'}
                </span>
              </button>
            </div>
          </form>

          {/* Menu List Section */}
          <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
            <div className='flex justify-between items-center'>
              <h3 className='text-[18px] inter-semibold'>메뉴 목록</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                className='border border-indigo-300 rounded-xl p-2 focus:outline-0 focus:border-indigo-600'
              >
                <option value={0}>전체 카테고리</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <div className='text-center py-8'>로딩중...</div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredMenus.map((menu) => (
                  <div
                    key={menu.menuId}
                    className='border border-indigo-300 rounded-2xl p-4 flex flex-col gap-2'
                  >
                    {menu.imageUrl && (
                      <div className='relative w-full h-48 rounded-xl overflow-hidden'>
                        <Image
                          src={menu.imageUrl}
                          alt={menu.menuName}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <h4 className='text-lg font-semibold'>{menu.menuName}</h4>
                    <p className='font-semibold'>
                      {menu.menuPrice.toLocaleString()}원
                    </p>
                    <p className='text-indigo-400'>
                      {menu.categories
                        .filter((cat) => cat.categoryName !== 'Default')
                        .map((cat) => cat.categoryName)
                        .join(', ')}
                    </p>
                    <div className='flex gap-2 mt-2'>
                      <button
                        onClick={() => setSelectedMenu(menu)}
                        className='flex-1 py-2 px-4 bg-indigo-600 hover:cursor-pointer text-white rounded-xl hover:bg-indigo-700'
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.menuId)}
                        className='flex-1 py-2 px-4 bg-red-500 hover:cursor-pointer text-white rounded-xl hover:opacity-80'
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Menu Modal */}
          {selectedMenu && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
              <form
                onSubmit={handleUpdateMenu}
                className='bg-white rounded-3xl p-6 w-[600px]'
              >
                <h3 className='text-[18px] inter-semibold mb-6'>메뉴 수정</h3>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-8'>
                    <div className='flex flex-col gap-2 flex-1'>
                      <label className='inter-semibold'>메뉴 이름</label>
                      <input
                        type='text'
                        value={selectedMenu.menuName}
                        onChange={(e) =>
                          setSelectedMenu({
                            ...selectedMenu,
                            menuName: e.target.value,
                          })
                        }
                        className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                      />
                    </div>
                    <div className='flex flex-col gap-2 flex-1'>
                      <label className='inter-semibold'>가격</label>
                      <input
                        type='number'
                        value={selectedMenu.menuPrice}
                        onChange={(e) =>
                          setSelectedMenu({
                            ...selectedMenu,
                            menuPrice: parseInt(e.target.value),
                          })
                        }
                        className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='inter-semibold'>카테고리</label>
                    <select
                      value={selectedMenu.categories[0]?.categoryId}
                      onChange={(e) =>
                        setSelectedMenu({
                          ...selectedMenu,
                          categories: [
                            {
                              categoryId: Number(e.target.value),
                              categoryName:
                                categories.find(
                                  (cat) =>
                                    cat.categoryId === Number(e.target.value)
                                )?.categoryName || '',
                            },
                          ],
                        })
                      }
                      className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                    >
                      {categories
                        .filter((cat) => cat.categoryName !== 'Default')
                        .map((category) => (
                          <option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.categoryName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='inter-semibold'>메뉴 이미지</label>
                    {selectedMenu.imageUrl && !updateImage && (
                      <div className='relative w-full h-48 rounded-xl overflow-hidden mb-2'>
                        <Image
                          src={selectedMenu.imageUrl}
                          alt={selectedMenu.menuName}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) =>
                        setUpdateImage(e.target.files?.[0] || null)
                      }
                      className='border border-indigo-300 rounded-2xl p-4 focus:outline-0 focus:border-indigo-600'
                    />
                    {updateImage && (
                      <div className='text-sm text-blue-500'>
                        새로운 이미지가 선택되었습니다
                      </div>
                    )}
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedMenu(null);
                        setUpdateImage(null);
                      }}
                      className='flex-1 py-2 px-4 bg-gray-200 rounded-xl hover:cursor-pointer hover:opacity-80'
                    >
                      취소
                    </button>
                    <button
                      type='submit'
                      disabled={submitting}
                      className='flex-1 py-2 px-4 bg-indigo-600 text-white rounded-xl hover:cursor-pointer hover:bg-indigo-700 disabled:opacity-50'
                    >
                      {submitting ? '처리중...' : '저장'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
  );
}