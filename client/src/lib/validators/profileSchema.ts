import { z } from 'zod';

export const serviceCenterSchema = z.object({
  name: z.string().max(150).optional(),
  address: z.string().max(300).optional(),
  contact: z.string().max(50).optional(),
  sealName: z.string().max(100).optional(),
});

export const businessProfileSchema = z.object({
  companyName: z.string().min(1, 'কোম্পানির নাম আবশ্যক').max(150),
  dutyParagraph: z.string().max(1000).optional(),
  businessRegNo: z.string().max(100).optional(),
  bankAccount: z.string().max(100).optional(),
  serviceCenter: serviceCenterSchema,
});

export type BusinessProfileValues = z.infer<typeof businessProfileSchema>;

export const passwordChangeSchema = z
  .object({
    password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে'),
    confirmPassword: z.string().min(1, 'পাসওয়ার্ড নিশ্চিত করুন'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'দুটো পাসওয়ার্ড মিলছে না',
    path: ['confirmPassword'],
  });

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
