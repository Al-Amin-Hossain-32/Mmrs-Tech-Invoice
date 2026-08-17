import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'ইমেইল দিন').email('সঠিক ইমেইল ফরম্যাট দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
