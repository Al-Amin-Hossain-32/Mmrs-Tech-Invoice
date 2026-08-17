import { Suspense } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-sm">
          <CardHeader />
          <CardContent className="flex justify-center py-10">
            <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </CardContent>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
