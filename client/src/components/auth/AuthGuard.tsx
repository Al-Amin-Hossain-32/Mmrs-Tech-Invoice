'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuthStore } from '@/lib/auth/authStore';
import type { UserRole } from '@/types/user';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Roles allowed to view this subtree. Omit to allow any authenticated user. */
  allowedRoles?: UserRole[];
}

/**
 * Client-side route guard.
 *
 * IMPORTANT: this exists because the current backend returns the JWT in the
 * response body (not an HttpOnly cookie), so the token only lives in
 * localStorage and cannot be read by Server Components or middleware.
 * Once auth migrates to cookies, this should be replaced by `middleware.ts`
 * doing the redirect BEFORE the page renders (better UX, no flash).
 */
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return; // wait for localStorage read to finish

    if (!user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [hasHydrated, user, allowedRoles, router, pathname]);

  // While hydrating, or before the redirect effect fires, render nothing to
  // avoid flashing protected content to an unauthenticated visitor.
  if (!hasHydrated || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
