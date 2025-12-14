'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import { SubscriptionService } from '@/lib/services/subscription.service';
import type { ActivePlan, SubscriptionPlan } from '@/types/subscription.types';
import { FaCrown, FaArrowUp, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface SubscriptionCardProps {
  userId: string;
}

export default function SubscriptionCard({ userId }: SubscriptionCardProps) {
  const [subscription, setSubscription] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use new Edge Service for subscription data
        const [subData, plansData] = await Promise.all([
          SubscriptionEdgeService.getActivePlan(),
          SubscriptionService.getPlans(), // Keep using old service for plans list
        ]);
        setSubscription(subData);
        setAllPlans(plansData);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  // Map new ActivePlan structure to component needs
  const currentPlanName = subscription?.plan; // 'trial' | 'hub' | 'edge' | null
  const isTrial = subscription?.plan === 'trial';
  const trialEnd = subscription?.end_date ? new Date(subscription.end_date) : null;
  const daysRemaining = subscription?.days_left ?? 0;
  const isExpired = subscription?.plan_expired ?? false;

  // Get plan display name from allPlans or use plan name
  const getPlanDisplayName = () => {
    if (!currentPlanName) return null;
    const plan = allPlans.find(p => p.name === currentPlanName);
    return plan?.display_name || currentPlanName.charAt(0).toUpperCase() + currentPlanName.slice(1);
  };

  const planDisplayName = getPlanDisplayName();

  // Get available upgrade plans based on new plan structure
  const getUpgradePlans = () => {
    if (!currentPlanName) return allPlans;

    // New plan order: trial (tier 1) -> hub (tier 2) -> edge (tier 3)
    const planOrder = ['hub', 'edge']; // Only show hub and edge as upgrades (trial is default)
    const currentTier = subscription?.tier || 0;

    return allPlans.filter(plan => {
      // Map plan names to tiers
      const planTiers: Record<string, number> = {
        'hub': 2,
        'edge': 3,
      };
      const planTier = planTiers[plan.name] || 0;
      return planTier > currentTier;
    });
  };

  const upgradePlans = getUpgradePlans();

  return (
    <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaCrown className="text-[#00FFC2] text-2xl" />
          <div>
            <h2 className="text-xl font-bold text-white">Your Subscription</h2>
            {currentPlanName ? (
              <p className="text-gray-400 text-sm">
                {planDisplayName}
                {isTrial && ` (Trial)`}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">No active subscription</p>
            )}
          </div>
        </div>
        {isTrial && trialEnd && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Trial ends in</div>
            <div className="text-lg font-bold text-[#00FFC2]">{daysRemaining} days</div>
          </div>
        )}
      </div>

      {currentPlanName && (
        <div className="mb-4 p-4 bg-[#1A1A1A] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Status</span>
            <span className={`font-semibold ${!isExpired ? 'text-green-400' : 'text-red-400'}`}>
              {isExpired ? 'Expired' : isTrial ? 'Trial Active' : 'Active'}
            </span>
          </div>
          {subscription?.end_date && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{isTrial ? 'Trial ends' : 'Renews on'}</span>
              <span className="text-white">
                {new Date(subscription.end_date).toLocaleDateString()}
              </span>
            </div>
          )}
          {isTrial && daysRemaining > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-300">Days remaining</span>
              <span className="text-[#00FFC2] font-semibold">
                {daysRemaining} / 14 days
              </span>
            </div>
          )}
        </div>
      )}

      {upgradePlans.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <FaArrowUp className="text-[#00FFC2]" />
            Upgrade Your Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upgradePlans.map((plan) => (
              <Link
                key={plan.id}
                href={`/checkout?plan=${plan.name}`}
                className="p-4 bg-[#1A1A1A] border border-gray-700 rounded-lg hover:border-[#00FFC2] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{plan.display_name}</span>
                  <span className="text-[#00FFC2] font-bold">
                    ${plan.price_monthly}/mo
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {plan.description || 'Upgrade to unlock more features'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!currentPlanName && (
        <div className="text-center py-4">
          <p className="text-gray-400 mb-4">Start your journey with a subscription plan</p>
          <Link
            href="/membership"
            className="inline-block px-6 py-3 bg-[#00FFC2] text-black rounded-lg font-semibold hover:bg-[#00E0AA] transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}

