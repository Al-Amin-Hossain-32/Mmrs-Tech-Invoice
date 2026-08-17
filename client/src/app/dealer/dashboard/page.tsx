import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DealerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ড্যাশবোর্ড</h1>
        <p className="text-sm text-muted-foreground">
          আপনার ইনভয়েস কার্যক্রমের সংক্ষিপ্ত বিবরণ
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>শীঘ্রই আসছে</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Phase 2-এ এখানে ইনভয়েস স্ট্যাটিস্টিক্স, সাম্প্রতিক ইনভয়েস তালিকা ও দ্রুত-অ্যাকশন
          বাটন যুক্ত হবে।
        </CardContent>
      </Card>
    </div>
  );
}
