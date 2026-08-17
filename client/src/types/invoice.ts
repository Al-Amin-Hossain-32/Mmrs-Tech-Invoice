export interface InvoicePaymentItem {
  paymentDate: string;
  serviceFee: string;
  amount: number;
}

export interface CustomerDetails {
  name: string;
  address?: string;
  mobileNo: string;
  email?: string;
}

export interface Invoice {
  _id: string;
  dealerId: string;
  invoiceType: string;
  barcodeNumber: string;
  jobsheetOrder: string;
  jobsheetDate: string;
  paymentDate: string;
  customerDetails: CustomerDetails;
  items: InvoicePaymentItem[];
  subtotal: number;
  signatureDate: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for POST /api/invoices — server derives dealerId from the auth token */
export type CreateInvoicePayload = Omit<
  Invoice,
  '_id' | 'dealerId' | 'createdAt' | 'updatedAt'
>;

export interface InvoiceListParams {
  startDate?: string;
  endDate?: string;
}
