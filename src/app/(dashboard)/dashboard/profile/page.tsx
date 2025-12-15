'use client';

import { useAppSelector } from '@/lib/store/hooks';
import AuthGuard from '@/components/auth/AuthGuard';
import ProfileView from '@/components/profile/ProfileView';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ProfilePage() {
  const { profile, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileView />
      </div>
    </AuthGuard>
  );
}

