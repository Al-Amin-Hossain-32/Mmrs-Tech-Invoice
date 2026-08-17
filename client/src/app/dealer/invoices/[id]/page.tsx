'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InvoicePrintView } from '@/components/invoices/InvoicePrintView';
import { DownloadInvoicePdfButton } from '@/components/invoices/DownloadInvoicePdfButton';
import { getInvoiceById } from '@/lib/api/invoices';
import { getProfile } from '@/lib/api/profile';
import type { Invoice } from '@/types/invoice';
import type { UserProfile } from '@/types/user';

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Invoice documents don't snapshot company/service-center info (see
        // Invoice.js) — the dealer's current profile is fetched alongside
        // and merged at render time in InvoicePrintView.
        const [invoiceData, profileData] = await Promise.all([
          getInvoiceById(params.id),
          getProfile(),
        ]);
        if (isMounted) {
          setInvoice(invoiceData);
          setProfile(profileData);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'ইনভয়েস লোড করা যায়নি');
          router.push('/dealer/invoices');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!invoice || !profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" onClick={() => router.push('/dealer/invoices')}>
          <ArrowLeft />
          তালিকায় ফিরুন
        </Button>
        <div className="flex gap-2">
          <DownloadInvoicePdfButton invoice={invoice} profile={profile} />
          <Button onClick={() => window.print()}>
            <Printer />
            Print
          </Button>
        </div>
      </div>

      <InvoicePrintView invoice={invoice} profile={profile} />
    </div>
  );
}
