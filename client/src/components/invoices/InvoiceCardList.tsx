import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/invoice/format';
import type { Invoice } from '@/types/invoice';

export function InvoiceCardList({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {invoices.map((invoice) => (
        <Link key={invoice._id} href={`/dealer/invoices/${invoice._id}`}>
          <Card className="py-4">
            <CardContent className="flex items-center justify-between px-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{invoice.customerDetails.name}</p>
                <p className="text-xs text-muted-foreground">{invoice.barcodeNumber}</p>
                <p className="text-xs text-muted-foreground">{invoice.paymentDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {formatCurrency(invoice.subtotal)}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
