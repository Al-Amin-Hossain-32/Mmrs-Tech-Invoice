'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, UserCog, Users, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth/authStore';

const NAV_BY_ROLE = {
  dealer: [
    { label: 'ড্যাশবোর্ড', href: '/dealer/dashboard', icon: LayoutDashboard },
    { label: 'ইনভয়েসসমূহ', href: '/dealer/invoices', icon: FileText },
    { label: 'প্রোফাইল', href: '/dealer/profile', icon: UserCog },
  ],
  admin: [
    { label: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'ডিলারগণ', href: '/admin/dealers', icon: Users },
  ],
} as const;

interface DashboardShellProps {
  role: keyof typeof NAV_BY_ROLE;
  roleLabel: string;
  children: React.ReactNode;
}

export function DashboardShell({ role, roleLabel, children }: DashboardShellProps) {
  const navItems = NAV_BY_ROLE[role];
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <span className="text-lg font-semibold tracking-tight">Smart-Tech</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div>
            <p className="text-sm font-medium">{user?.companyName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 bg-secondary/30 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
