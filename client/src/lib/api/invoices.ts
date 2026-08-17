import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/types/api';
import type { CreateInvoicePayload, Invoice, InvoiceListParams } from '@/types/invoice';

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  const { data } = await apiClient.post<ApiSuccess<Invoice>>('/api/invoices', payload);
  return data.data;
}

export async function getMyInvoices(params?: InvoiceListParams): Promise<Invoice[]> {
  const { data } = await apiClient.get<ApiSuccess<Invoice[]>>('/api/invoices', { params });
  return data.data;
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const { data } = await apiClient.get<ApiSuccess<Invoice>>(`/api/invoices/${id}`);
  return data.data;
}
