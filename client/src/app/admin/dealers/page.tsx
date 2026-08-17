'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Users, FileText, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DealerTable } from '@/components/admin/DealerTable';
import { getAllDealers } from '@/lib/api/admin';
import { formatCurrency } from '@/lib/invoice/format';
import type { DealerWithStats } from '@/types/user';

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<DealerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAllDealers()
      .then((data) => {
        if (isMounted) setDealers(data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'ডিলার তালিকা লোড করা যায়নি');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalInvoices = dealers.reduce((sum, d) => sum + d.invoiceCount, 0);
  const totalRevenue = dealers.reduce((sum, d) => sum + d.totalSubtotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ডিলারগণ</h1>
          <p className="text-sm text-muted-foreground">মোট {dealers.length} জন ডিলার</p>
        </div>
        <Button asChild>
          <Link href="/admin/dealers/new">
            <Plus />
            নতুন ডিলার
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={Users} label="মোট ডিলার" value={dealers.length.toString()} />
        <SummaryCard icon={FileText} label="মোট ইনভয়েস" value={totalInvoices.toString()} />
        <SummaryCard icon={Wallet} label="মোট আয়" value={formatCurrency(totalRevenue)} />
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : dealers.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">কোনো ডিলার পাওয়া যায়নি</p>
          <Button asChild variant="link">
            <Link href="/admin/dealers/new">প্রথম ডিলার তৈরি করুন</Link>
          </Button>
        </div>
      ) : (
        <DealerTable dealers={dealers} />
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
