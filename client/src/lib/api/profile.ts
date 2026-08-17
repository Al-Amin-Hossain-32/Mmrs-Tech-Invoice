import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/types/api';
import type { ServiceCenter, UserProfile } from '@/types/user';

export interface UpdateProfilePayload {
  companyName?: string;
  dutyParagraph?: string;
  businessRegNo?: string;
  bankAccount?: string;
  serviceCenter?: Partial<ServiceCenter>;
  password?: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiSuccess<UserProfile>>('/api/profile');
  return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const { data } = await apiClient.put<ApiSuccess<UserProfile>>('/api/profile', payload);
  return data.data;
}
