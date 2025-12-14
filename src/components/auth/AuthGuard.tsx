'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import type { UserRole } from '@/types/auth.types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, profile } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to user's default dashboard
        const dashboardPath = `/dashboard/${profile?.role || 'player'}`;
        router.push(dashboardPath);
        return;
      }
    }
  }, [isAuthenticated, isLoading, profile, requiredRole, router]);

  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return fallback || null;
  }

  return <>{children}</>;
}

