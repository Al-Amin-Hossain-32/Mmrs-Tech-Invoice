import axios, { type AxiosError } from 'axios';

import { useAuthStore } from '@/lib/auth/authStore';
import type { ApiError } from '@/types/api';

/**
 * Single axios instance for the whole app.
 *
 * MIGRATION NOTE: this file is the ONLY place that needs to change when the
 * backend switches to HttpOnly cookies. At that point:
 *   - remove the request interceptor below (browser sends the cookie automatically)
 *   - add `withCredentials: true` to the instance config
 *   - the 401 handling stays exactly the same
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the Bearer token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handling: token missing/expired/invalid -> force logout.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        // Intentional hard navigation: this interceptor runs outside React's
        // render tree, so the Next.js router (useRouter) isn't reachable here.
        const currentPath = window.location.pathname;
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
      }
    }

    // Normalize the error message so callers don't need to know axios's shape.
    const message =
      error.response?.data?.message ?? error.message ?? 'অপ্রত্যাশিত একটি সমস্যা হয়েছে';
    return Promise.reject(new Error(message));
  },
);
