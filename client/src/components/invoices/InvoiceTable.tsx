import Link from 'next/link';
import { Eye } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/invoice/format';
import type { Invoice } from '@/types/invoice';

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>বারকোড নম্বর</TableHead>
            <TableHead>গ্রাহক</TableHead>
            <TableHead>মোবাইল</TableHead>
            <TableHead>পেমেন্ট তারিখ</TableHead>
            <TableHead className="text-right">সাবটোটাল</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell className="font-medium">{invoice.barcodeNumber}</TableCell>
              <TableCell>{invoice.customerDetails.name}</TableCell>
              <TableCell>{invoice.customerDetails.mobileNo}</TableCell>
              <TableCell>{invoice.paymentDate}</TableCell>
              <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dealer/invoices/${invoice._id}`}>
                    <Eye className="size-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
