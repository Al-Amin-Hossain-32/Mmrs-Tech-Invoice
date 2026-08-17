'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { InvoiceCardList } from '@/components/invoices/InvoiceCardList';
import { getMyInvoices } from '@/lib/api/invoices';
import type { Invoice } from '@/types/invoice';

export default function DealerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchInvoices = useCallback(async (params?: { startDate?: string; endDate?: string }) => {
    setIsLoading(true);
    try {
      const data = await getMyInvoices(params);
      setInvoices(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ইনভয়েস লোড করা যায়নি');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern; setState happens after the awaited API call, not synchronously
    fetchInvoices();
  }, [fetchInvoices]);

  function handleFilter() {
    fetchInvoices(startDate && endDate ? { startDate, endDate } : undefined);
  }

  function handleClearFilter() {
    setStartDate('');
    setEndDate('');
    fetchInvoices();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ইনভয়েসসমূহ</h1>
          <p className="text-sm text-muted-foreground">মোট {invoices.length}টি ইনভয়েস</p>
        </div>
        <Button asChild>
          <Link href="/dealer/invoices/new">
            <Plus />
            নতুন ইনভয়েস
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
        <div className="grid gap-1.5">
          <Label htmlFor="startDate">শুরুর তারিখ</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="endDate">শেষ তারিখ</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={handleFilter} disabled={!startDate || !endDate}>
          <Search />
          ফিল্টার করুন
        </Button>
        {(startDate || endDate) && (
          <Button variant="ghost" onClick={handleClearFilter}>
            মুছে ফেলুন
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">কোনো ইনভয়েস পাওয়া যায়নি</p>
          <Button asChild variant="link">
            <Link href="/dealer/invoices/new">প্রথম ইনভয়েস তৈরি করুন</Link>
          </Button>
        </div>
      ) : (
        <>
          <InvoiceTable invoices={invoices} />
          <InvoiceCardList invoices={invoices} />
        </>
      )}
    </div>
  );
}
