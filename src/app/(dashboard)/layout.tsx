'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { checkAuth } from '@/lib/store/slices/auth.slice';
import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Navbar />
        <main className="flex-1 my-3 md:my-4">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}

