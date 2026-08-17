'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { BusinessProfileForm } from '@/components/profile/BusinessProfileForm';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';
import { getProfile } from '@/lib/api/profile';
import { useAuthStore } from '@/lib/auth/authStore';
import type { UserProfile } from '@/types/user';

export default function DealerProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    getProfile()
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'প্রোফাইল লোড করা যায়নি');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleProfileUpdated(updated: UserProfile) {
    setProfile(updated);
    // Keep the sidebar/topbar (which reads from authStore) in sync with the new companyName.
    if (authUser) {
      setUser({ ...authUser, companyName: updated.companyName });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">প্রোফাইল</h1>
        <p className="text-sm text-muted-foreground">
          আপনার ব্যবসায়িক তথ্য ও পাসওয়ার্ড পরিচালনা করুন
        </p>
      </div>

      {isLoading || !profile ? (
        <div className="space-y-4">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <BusinessProfileForm profile={profile} onUpdated={handleProfileUpdated} />
          <PasswordChangeForm />
        </>
      )}
    </div>
  );
}
