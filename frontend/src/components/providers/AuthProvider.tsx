'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [checkAuth]);

  return <>{children}</>;
}
