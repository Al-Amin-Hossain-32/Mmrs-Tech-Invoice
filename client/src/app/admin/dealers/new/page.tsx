'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createDealer } from '@/lib/api/auth';
import { createDealerSchema, type CreateDealerValues } from '@/lib/validators/dealerSchema';

export default function NewDealerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateDealerValues>({
    resolver: zodResolver(createDealerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: CreateDealerValues) {
    setIsSubmitting(true);
    try {
      await createDealer(values);
      toast.success('ডিলার তৈরি হয়েছে');
      router.push('/admin/dealers');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ডিলার তৈরি করা যায়নি');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">নতুন ডিলার তৈরি করুন</h1>
        <p className="text-sm text-muted-foreground">
          ডিলার পরে নিজের প্রোফাইল থেকে ব্যবসায়িক তথ্য যোগ করতে পারবে
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ডিলার অ্যাকাউন্ট তথ্য</CardTitle>
          <CardDescription>এই তথ্য দিয়ে ডিলার লগইন করবেন</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নাম</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>প্রাথমিক পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  বাতিল
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
                  ডিলার তৈরি করুন
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
