'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchWithToken } from '@/utils/fetchWithToken';

interface StoreInfo {
  email: string;
  adminName: string;
  storeName: string;
  kioskCount: number;
}

export default function Dashboard() {
  const [formData, setFormData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    storeName: '',
    adminName: '',
    tableCount: '',
  });

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/store-info`
        );

        const data: StoreInfo = await response.json();
        setFormData((prev) => ({
          ...prev,
          email: data.email,
          adminName: data.adminName,
          storeName: data.storeName,
          tableCount: data.kioskCount.toString(),
        }));
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    fetchStoreInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStoreNameSubmit = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/store-name`,
        {
          method: 'PUT',
          body: JSON.stringify({ storeName: formData.storeName }),
        }
      );
      if (!response.ok) throw new Error('Failed to update store name');
      console.log('Store name updated successfully');
    } catch (error) {
      console.error('Store name update failed:', error);
    }
  };

  const handleAdminNameSubmit = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/admin-name`,
        {
          method: 'PUT',
          body: JSON.stringify({ adminName: formData.adminName }),
        }
      );
      if (!response.ok) throw new Error('Failed to update admin name');
      console.log('Admin name updated successfully');
    } catch (error) {
      console.error('Admin name update failed:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/password`,
        {
          method: 'PUT',
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update password');
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Password update failed:', error);
    }
  };

  const handleTableCountSubmit = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/table-count`,
        {
          method: 'PUT',
          body: JSON.stringify({ tableCount: formData.tableCount }),
        }
      );
      if (!response.ok) throw new Error('Failed to update table count');
      console.log('Table count updated successfully');
    } catch (error) {
      console.error('Table count update failed:', error);
    }
  };

  return (
    <div className='h-full flex-1 p-8 flex flex-col gap-[30px] overflow-y-scroll'>
      <div className='flex flex-col'>
        <h1 className='text-[32px] inter-semibold'>가게 관리</h1>
        <h2 className='text-[16px] inter-medium text-ml-gray-dark'>
          Store Management
        </h2>
      </div>

      <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
        <h3 className='text-[18px] inter-semibold'>가게정보</h3>
        <div className='flex gap-4 w-full justify-between'>
          <div className='flex flex-col  gap-2'>
            <span className='inter-semibold'>Email</span>
            <div className='flex gap-8 w-full'>
              <span className='w-[400px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow inter-regular'>
                {formData.email}
              </span>
            </div>
          </div>

          <div className='flex flex-col  gap-2 mr-20'>
            <span className='inter-semibold'>기존 비밀번호</span>
            <div className='flex gap-8 w-full'>
              <input
                id='oldPassword'
                type='password'
                value={formData.oldPassword}
                onChange={handleChange}
                className='w-[300px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
              />
            </div>
          </div>
        </div>

        <div className='flex gap-4 w-full justify-between'>
          <div className='flex flex-col  gap-2'>
            <span className='inter-semibold'>가게 이름</span>
            <div className='flex gap-8 w-full'>
              <input
                id='storeName'
                type='text'
                value={formData.storeName}
                onChange={handleChange}
                placeholder='가게 이름'
                className='w-[400px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
              />
              <button
                onClick={handleStoreNameSubmit}
                className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px]'
              >
                <Image src='Submit.svg' alt='add' width={16} height={16} />
                <span className='inter-regular '>가게 이름 변경</span>
              </button>
            </div>
          </div>
          <div className='flex flex-col  gap-2 mr-20'>
            <span className='inter-semibold'>변경할 비밀번호</span>
            <div className='flex gap-8 w-full'>
              <input
                id='newPassword'
                type='password'
                value={formData.newPassword}
                onChange={handleChange}
                className='w-[300px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
              />
            </div>
          </div>
        </div>

        <div className='flex gap-4 w-full'>
          <div className='flex flex-col  gap-2 w-full'>
            <span className='inter-semibold'>사장님 이름</span>
            <div className='flex w-full justify-between'>
              <div className='flex gap-8 '>
                <input
                  id='adminName'
                  type='text'
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder='사장님 이름'
                  className='w-[400px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
                />
                <button
                  onClick={handleAdminNameSubmit}
                  className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px]'
                >
                  <Image src='Submit.svg' alt='add' width={16} height={16} />
                  <span className='inter-regular '>사장님 이름 변경</span>
                </button>
              </div>

              <button
                onClick={handlePasswordChange}
                className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px] mr-20'
              >
                <Image src='Submit.svg' alt='add' width={16} height={16} />
                <span className='inter-regular '>비밀번호 변경</span>
              </button>
            </div>
          </div>
        </div>

        <div className='flex gap-4 w-full'>
          <div className='flex flex-col  gap-2'>
            <span className='inter-semibold'>테이블 수 설정</span>
            <div className='flex gap-8 w-full'>
              <input
                id='tableCount'
                type='number'
                value={formData.tableCount}
                onChange={handleChange}
                placeholder='테이블수'
                className='w-[400px] border border-ml-gray-dark rounded-2xl p-4 focus:outline-0 focus:border-ml-yellow'
              />
              <button
                onClick={handleTableCountSubmit}
                className='flex items-center justify-center gap-2 rounded-2xl bg-ml-yellow text-white p-4 w-[200px]'
              >
                <Image src='Submit.svg' alt='add' width={16} height={16} />
                <span className='inter-regular '>테이블 수 등록</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
