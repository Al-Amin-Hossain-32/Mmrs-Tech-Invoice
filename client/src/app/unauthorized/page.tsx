import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">অ্যাক্সেস অনুমোদিত নয়</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        এই পেজ দেখার জন্য আপনার অ্যাকাউন্টের প্রয়োজনীয় অনুমতি নেই।
      </p>
      <Button asChild>
        <Link href="/login">লগইন পেজে ফিরে যান</Link>
      </Button>
    </div>
  );
}
