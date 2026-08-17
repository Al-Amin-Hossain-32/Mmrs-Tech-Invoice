import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '@/types/user';

interface AuthState {
  user: AuthUser | null;
  /** True once zustand has finished reading persisted state from localStorage. */
  hasHydrated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
