'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loadProfile } from '@/lib/store/slices/auth.slice';
import AuthGuard from '@/components/auth/AuthGuard';
import PlayerDashboard from '@/components/dashboard/PlayerDashboard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function PlayerDashboardPage() {
  const dispatch = useAppDispatch();
  const { user, profile, playerProfile, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user && !playerProfile) {
      dispatch(loadProfile(user.id));
    }
  }, [user, playerProfile, dispatch]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="player">
      <PlayerDashboard />
    </AuthGuard>
  );
}

