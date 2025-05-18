import { Category } from '@/types/Category';

export const mockCategories: Category[] = [
  {
    category_id: '1',
    category_name: 'Electronics',
  },
  {
    category_id: '2',
    category_name: 'Clothing',
  },
  {
    category_id: '3',
    category_name: 'Home & Kitchen',
  },
  {
    category_id: '4',
    category_name: 'Books',
  },
  {
    category_id: '5',
    category_name: 'Sports & Outdoors',
  },
];

// 또는 동적으로 생성하는 경우
export function generateMockCategories(count: number): Category[] {
  return Array.from({ length: count }, (_, i) => ({
    category_id: (i + 1).toString(),
    category_name: `Category ${i + 1}`,
  }));
}
