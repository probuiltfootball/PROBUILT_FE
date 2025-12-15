'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import AuthGuard from '@/components/auth/AuthGuard';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import type { ActivePlan } from '@/types/subscription.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import MyTrail from '@/components/dashboard/MyTrail';
import MyHub from '@/components/dashboard/MyHub';
import MyEdge from '@/components/dashboard/MyEdge';
import DashboardNav from '@/components/dashboard/DashboardNav';

/**
 * Main Dashboard Page
 * Acts as a wrapper that fetches active subscription and renders the correct component:
 * - MyTrail for trial users
 * - MyHub for hub subscribers
 * - MyEdge for edge subscribers
 */
export default function DashboardPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivePlan = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const plan = await SubscriptionEdgeService.getActivePlan();
        setActivePlan(plan);
      } catch (error) {
        console.error('Failed to load active plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivePlan();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Render based on plan
  const renderContent = () => {
    if (!activePlan || !activePlan.plan) {
      // No active plan - show trial (new users get auto-assigned trial)
      return <MyTrail activePlan={activePlan} />;
    }

    switch (activePlan.plan) {
      case 'trial':
        return <MyTrail activePlan={activePlan} />;
      case 'hub':
        return <MyHub activePlan={activePlan} />;
      case 'edge':
        return <MyEdge activePlan={activePlan} />;
      default:
        return <MyTrail activePlan={activePlan} />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <DashboardNav />
        {renderContent()}
      </div>
    </AuthGuard>
  );
}

