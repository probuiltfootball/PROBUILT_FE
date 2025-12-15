'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loadProfile } from '@/lib/store/slices/auth.slice';
import AuthGuard from '@/components/auth/AuthGuard';
import HubContent from '@/components/hub/HubContent';
import DashboardNav from '@/components/dashboard/DashboardNav';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function HubContentPage() {
    const dispatch = useAppDispatch();
    const { user, profile, isLoading } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (user && !profile) {
            dispatch(loadProfile(user.id));
        }
    }, [user, profile, dispatch]);

    if (isLoading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E]">
                <DashboardNav />
                <HubContent />
            </div>
        </AuthGuard>
    );
}

