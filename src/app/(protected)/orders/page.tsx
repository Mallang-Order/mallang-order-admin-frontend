'use client';

import { useState, useEffect } from 'react';
import { fetchWithToken } from '@/utils/fetchWithToken';
import Image from 'next/image';

interface Order {
  id: string;
  tableNumber: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'preparing' | 'completed';
  totalAmount: number;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`
      );
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error('Failed to update order status');

      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-indigo-100 text-indigo-700';
      case 'preparing':
        return 'bg-indigo-200 text-indigo-800';
      case 'completed':
        return 'bg-indigo-300 text-indigo-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='h-full flex-1 p-8 flex flex-col gap-[30px] overflow-y-scroll'>
      <div className='flex flex-col'>
        <h1 className='text-[32px] inter-semibold'>주문 관리</h1>
        <h2 className='text-[16px] inter-medium text-ml-gray-dark'>
          Order Management
        </h2>
      </div>

      <div className='bg-white rounded-3xl p-6 flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <h3 className='text-[18px] inter-semibold'>테이블별 주문 현황</h3>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className='flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 text-white px-4 py-2 disabled:opacity-50 hover:bg-indigo-600'
          >
            <Image src='/Refresh.svg' alt='refresh' width={16} height={16} />
            <span className='inter-regular'>
              {loading ? '로딩중...' : '새로고침'}
            </span>
          </button>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <span className='text-indigo-400'>주문 정보를 불러오는 중...</span>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-4'>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((tableNum) => {
              const tableOrders = orders.filter(
                (order) => order.tableNumber === tableNum
              );
              const hasActiveOrders = tableOrders.some(
                (order) => order.status !== 'completed'
              );
              return (
                <div
                  key={tableNum}
                  className={`p-4 rounded-xl border shadow-md ${
                    hasActiveOrders
                      ? 'border-indigo-500 bg-white'
                      : 'border-indigo-200 bg-white'
                  }`}
                >
                  <div className='flex w-[200px] gap-20 justify-center items-center bg-[#F2F2F7] p-4 w-full'>
                    <div className='flex gap-2'>
                      <Image
                        src='/ForkKnife.svg'
                        alt='fork-knife'
                        width={30}
                        height={30}
                      />
                      <span className='text-2xl'>{tableNum}</span>
                    </div>

                    <span
                      className={`p-4 rounded-2xl whitespace-nowrap ${
                        hasActiveOrders
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-indigo-200 text-indigo-900'
                      }`}
                    >
                      {hasActiveOrders ? '사용중' : '빈테이블'}
                    </span>
                  </div>

                  <div className='mt-4'>
                    {tableOrders.length > 0 ? (
                      <div className='space-y-4'>
                        {tableOrders.map((order) => (
                          <div key={order.id} className='border-t pt-4'>
                            <div className='flex justify-between items-center mb-2'>
                              <div className='text-sm text-gray-500'>
                                {formatDate(order.createdAt)}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status === 'pending' && '대기중'}
                                {order.status === 'preparing' && '준비중'}
                                {order.status === 'completed' && '완료'}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className='flex justify-between text-sm'
                                >
                                  <span>
                                    {item.name} x {item.quantity}
                                  </span>
                                  <span>
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                    원
                                  </span>
                                </div>
                              ))}
                              <div className='flex justify-between font-semibold pt-2'>
                                <span>총 금액</span>
                                <span>
                                  {order.totalAmount.toLocaleString()}원
                                </span>
                              </div>
                            </div>
                            {order.status !== 'completed' && (
                              <div className='mt-3 flex justify-end gap-2'>
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order.id, 'preparing')
                                    }
                                    className='px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600'
                                  >
                                    준비 시작
                                  </button>
                                )}
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(order.id, 'completed')
                                    }
                                    className='px-3 py-1.5 bg-indigo-700 text-white text-sm rounded-lg hover:bg-indigo-800'
                                  >
                                    완료 처리
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center text-indigo-500 py-4 w-full border border-indigo-300'>
                        주문 없음
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
