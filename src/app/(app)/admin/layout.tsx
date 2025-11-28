'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from "@/components/ui"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && !isAdmin) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Loading
  if (isLoading) {
    return <Spinner />
  }


  // Non admin → nascosto (redirect in corso)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
