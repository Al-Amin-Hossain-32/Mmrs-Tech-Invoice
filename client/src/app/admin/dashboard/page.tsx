'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Wallet, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllDealers } from '@/lib/api/admin';
import { formatCurrency } from '@/lib/invoice/format';
import type { DealerWithStats } from '@/types/user';

export default function AdminDashboardPage() {
  const [dealers, setDealers] = useState<DealerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAllDealers()
      .then((data) => {
        if (isMounted) setDealers(data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'ডেটা লোড করা যায়নি');
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
  const topDealers = [...dealers].sort((a, b) => b.totalSubtotal - a.totalSubtotal).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="text-sm text-muted-foreground">প্ল্যাটফর্মের সার্বিক পরিসংখ্যান</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="মোট ডিলার" value={dealers.length.toString()} />
          <StatCard icon={FileText} label="মোট ইনভয়েস" value={totalInvoices.toString()} />
          <StatCard icon={Wallet} label="মোট আয়" value={formatCurrency(totalRevenue)} />
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">শীর্ষ ডিলার (আয় অনুযায়ী)</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/dealers">
              সব দেখুন
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : topDealers.length === 0 ? (
            <p className="text-sm text-muted-foreground">এখনো কোনো ডিলার নেই</p>
          ) : (
            <div className="divide-y">
              {topDealers.map((dealer) => (
                <div key={dealer._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{dealer.name}</p>
                    <p className="text-xs text-muted-foreground">{dealer.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(dealer.totalSubtotal)}</p>
                    <p className="text-xs text-muted-foreground">{dealer.invoiceCount}টি ইনভয়েস</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
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
