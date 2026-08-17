'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createInvoice } from '@/lib/api/invoices';
import { invoiceFormSchema, type InvoiceFormValues } from '@/lib/validators/invoiceSchema';
import {
  datetimeLocalToBackend,
  nowForDatetimeLocalInput,
} from '@/lib/invoice/datetime';
import { suggestBarcodeNumber, suggestJobsheetOrder } from '@/lib/invoice/format';
import { INVOICE_ITEM_ROW_COUNT, DEFAULT_ITEM_LABELS } from '@/lib/invoice/itemTemplate';

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultNow = useMemo(() => nowForDatetimeLocalInput(), []);
  const defaultItems = useMemo(
    () =>
      Array.from({ length: INVOICE_ITEM_ROW_COUNT }, (_, i) => ({
        paymentDate: defaultNow,
        serviceFee: DEFAULT_ITEM_LABELS[i] ?? '',
        amount: 0,
      })),
    [defaultNow],
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceType: 'Retail Invoice',
      barcodeNumber: suggestBarcodeNumber(),
      jobsheetOrder: suggestJobsheetOrder(),
      jobsheetDate: defaultNow,
      paymentDate: defaultNow,
      customerDetails: { name: '', address: '', mobileNo: '', email: '' },
      items: defaultItems,
      signatureDate: '',
    },
  });

  const items = form.watch('items');
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  async function onSubmit(values: InvoiceFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        jobsheetDate: datetimeLocalToBackend(values.jobsheetDate),
        paymentDate: datetimeLocalToBackend(values.paymentDate),
        signatureDate: values.signatureDate ? datetimeLocalToBackend(values.signatureDate) : '',
        items: values.items.map((item) => ({
          ...item,
          paymentDate: datetimeLocalToBackend(item.paymentDate),
          amount: Number(item.amount),
        })),
        subtotal,
      };

      const created = await createInvoice(payload);
      toast.success('ইনভয়েস তৈরি হয়েছে');
      router.push(`/dealer/invoices/${created._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ইনভয়েস তৈরি করা যায়নি');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">নতুন ইনভয়েস তৈরি করুন</h1>
        <p className="text-sm text-muted-foreground">
          বারকোড ও জবশিট নম্বর স্বয়ংক্রিয়ভাবে সাজেস্ট করা হয়েছে, প্রয়োজনে বদলে নিন
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ইনভয়েস তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="barcodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>বারকোড নম্বর</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobsheetOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>জবশিট অর্ডার</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobsheetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>জবশিট তারিখ</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পেমেন্ট তারিখ</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">গ্রাহকের তথ্য</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customerDetails.name"
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
                name="customerDetails.mobileNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>মোবাইল নম্বর</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerDetails.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল (ঐচ্ছিক)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerDetails.address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>ঠিকানা (ঐচ্ছিক)</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">পেমেন্ট আইটেম</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {defaultItems.map((_, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`items.${index}.serviceFee`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বিবরণ</FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: Cash, bKash" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পরিমাণ</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.paymentDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>তারিখ</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
                <span className="text-sm font-medium">সাবটোটাল</span>
                <span className="text-lg font-semibold">{subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              বাতিল
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              ইনভয়েস সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
