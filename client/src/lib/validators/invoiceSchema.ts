import { z } from 'zod';

export const invoiceItemSchema = z.object({
  paymentDate: z.string().min(1, 'তারিখ আবশ্যক'),
  serviceFee: z.string().min(1, 'বিবরণ আবশ্যক').max(100),
  amount: z.coerce.number().min(0, 'ঋণাত্মক মূল্য দেওয়া যাবে না'),
});

export const customerDetailsSchema = z.object({
  name: z.string().min(1, 'গ্রাহকের নাম আবশ্যক').max(150),
  address: z.string().max(300).optional(),
  mobileNo: z
    .string()
    .min(1, 'মোবাইল নম্বর আবশ্যক')
    .regex(/^[0-9+\-\s]{7,20}$/, 'সঠিক মোবাইল নম্বর দিন'),
  email: z.union([z.string().email('সঠিক ইমেইল দিন'), z.literal('')]).optional(),
});

export const invoiceFormSchema = z.object({
  invoiceType: z.string().min(1),
  barcodeNumber: z.string().min(1, 'বারকোড নম্বর আবশ্যক'),
  jobsheetOrder: z.string().min(1, 'জবশিট অর্ডার নম্বর আবশ্যক'),
  jobsheetDate: z.string().min(1, 'জবশিট তারিখ আবশ্যক'),
  paymentDate: z.string().min(1, 'পেমেন্ট তারিখ আবশ্যক'),
  customerDetails: customerDetailsSchema,
  items: z.array(invoiceItemSchema).min(1),
  signatureDate: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
