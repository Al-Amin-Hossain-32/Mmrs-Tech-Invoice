import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardShell role="admin" roleLabel="Admin Panel">
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
