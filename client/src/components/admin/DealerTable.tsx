import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/invoice/format';
import type { DealerWithStats } from '@/types/user';

export function DealerTable({ dealers }: { dealers: DealerWithStats[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>নাম</TableHead>
            <TableHead>ইমেইল</TableHead>
            <TableHead>কোম্পানি</TableHead>
            <TableHead className="text-right">মোট ইনভয়েস</TableHead>
            <TableHead className="text-right">মোট আয়</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dealers.map((dealer) => (
            <TableRow key={dealer._id}>
              <TableCell className="font-medium">{dealer.name}</TableCell>
              <TableCell className="text-muted-foreground">{dealer.email}</TableCell>
              <TableCell>{dealer.companyName}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{dealer.invoiceCount}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(dealer.totalSubtotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
