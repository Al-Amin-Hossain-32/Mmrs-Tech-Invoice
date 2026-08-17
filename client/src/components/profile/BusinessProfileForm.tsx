'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  businessProfileSchema,
  type BusinessProfileValues,
} from '@/lib/validators/profileSchema';
import type { UserProfile } from '@/types/user';

interface BusinessProfileFormProps {
  profile: UserProfile;
  onUpdated: (profile: UserProfile) => void;
}

export function BusinessProfileForm({ profile, onUpdated }: BusinessProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessProfileValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      companyName: profile.companyName,
      dutyParagraph: profile.dutyParagraph,
      businessRegNo: profile.businessRegNo,
      bankAccount: profile.bankAccount,
      serviceCenter: {
        name: profile.serviceCenter?.name ?? '',
        address: profile.serviceCenter?.address ?? '',
        contact: profile.serviceCenter?.contact ?? '',
        sealName: profile.serviceCenter?.sealName ?? '',
      },
    },
  });

  async function onSubmit(values: BusinessProfileValues) {
    setIsSubmitting(true);
    try {
      const updated = await updateProfile(values);
      onUpdated(updated);
      toast.success('ব্যবসায়িক তথ্য আপডেট হয়েছে');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'আপডেট করা যায়নি');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ব্যবসায়িক তথ্য</CardTitle>
        <CardDescription>এই তথ্যগুলো ইনভয়েসের হেডারে দেখানো হয়</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>কোম্পানির নাম</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessRegNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ব্যবসায়িক নিবন্ধন নম্বর</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ব্যাংক অ্যাকাউন্ট</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dutyParagraph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duty Paragraph</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                সার্ভিস সেন্টার তথ্য
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="serviceCenter.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>সার্ভিস সেন্টারের নাম</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceCenter.contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>যোগাযোগ নম্বর</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceCenter.address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>ঠিকানা</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceCenter.sealName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>সিল নাম (Footer-এ দেখাবে)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
