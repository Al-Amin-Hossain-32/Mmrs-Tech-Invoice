import { z } from 'zod';

export const createDealerSchema = z.object({
  name: z.string().min(1, 'নাম আবশ্যক').max(150),
  email: z.string().min(1, 'ইমেইল আবশ্যক').email('সঠিক ইমেইল ফরম্যাট দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে'),
});

export type CreateDealerValues = z.infer<typeof createDealerSchema>;
