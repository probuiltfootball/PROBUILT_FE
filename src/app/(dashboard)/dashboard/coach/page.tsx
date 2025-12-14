'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loadProfile } from '@/lib/store/slices/auth.slice';
import AuthGuard from '@/components/auth/AuthGuard';
import CoachDashboard from '@/components/dashboard/CoachDashboard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function CoachDashboardPage() {
  const dispatch = useAppDispatch();
  const { user, profile, coachProfile, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user && !coachProfile) {
      dispatch(loadProfile(user.id));
    }
  }, [user, coachProfile, dispatch]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="coach">
      <CoachDashboard />
    </AuthGuard>
  );
}

