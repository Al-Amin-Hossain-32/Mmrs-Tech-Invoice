'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, KeyRound } from 'lucide-react';

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
import { updateProfile } from '@/lib/api/profile';
import { passwordChangeSchema, type PasswordChangeValues } from '@/lib/validators/profileSchema';

export function PasswordChangeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(values: PasswordChangeValues) {
    setIsSubmitting(true);
    try {
      await updateProfile({ password: values.password });
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'পাসওয়ার্ড পরিবর্তন করা যায়নি');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">পাসওয়ার্ড পরিবর্তন</CardTitle>
        <CardDescription>নতুন পাসওয়ার্ড দিলে সাথে সাথে কার্যকর হবে</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নিশ্চিত করুন</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <KeyRound />}
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
