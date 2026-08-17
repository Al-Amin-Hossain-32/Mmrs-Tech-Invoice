import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/types/api';
import type { DealerWithStats } from '@/types/user';

export async function getAllDealers(): Promise<DealerWithStats[]> {
  const { data } = await apiClient.get<ApiSuccess<DealerWithStats[]>>('/api/admin/dealers');
  return data.data;
}
