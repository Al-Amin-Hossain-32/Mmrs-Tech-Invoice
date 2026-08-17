'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/auth/authStore';
import { loginSchema, type LoginFormValues } from '@/lib/validators/authSchema';

const DASHBOARD_BY_ROLE = {
  admin: '/admin/dashboard',
  dealer: '/dealer/dashboard',
} as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hasHydrated, setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Already logged in? Skip the login screen.
  useEffect(() => {
    if (hasHydrated && user) {
      router.replace(DASHBOARD_BY_ROLE[user.role]);
    }
  }, [hasHydrated, user, router]);

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const authUser = await login(values);
      setUser(authUser);

      const redirectTo = searchParams.get('redirectTo');
      router.replace(redirectTo || DASHBOARD_BY_ROLE[authUser.role]);
      toast.success(`স্বাগতম, ${authUser.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">লগইন করুন</CardTitle>
        <CardDescription>Dealer অথবা Admin অ্যাকাউন্ট দিয়ে প্রবেশ করুন</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ইমেইল</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
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
                  <FormLabel>পাসওয়ার্ড</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              প্রবেশ করুন
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
