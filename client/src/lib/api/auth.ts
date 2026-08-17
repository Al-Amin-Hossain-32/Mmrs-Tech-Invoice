import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/types/api';
import type { AuthUser } from '@/types/user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateDealerPayload {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  dutyParagraph?: string;
  businessRegNo?: string;
  bankAccount?: string;
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiSuccess<AuthUser>>('/api/auth/login', payload);
  return data.data;
}

export async function createDealer(
  payload: CreateDealerPayload,
): Promise<Omit<AuthUser, 'token'>> {
  const { data } = await apiClient.post<ApiSuccess<Omit<AuthUser, 'token'>>>(
    '/api/auth/create-dealer',
    payload,
  );
  return data.data;
}
