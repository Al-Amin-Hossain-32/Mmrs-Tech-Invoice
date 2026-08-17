import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['dealer']}>
      <DashboardShell role="dealer" roleLabel="Dealer Panel">
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
