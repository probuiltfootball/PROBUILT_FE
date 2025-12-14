'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown } from 'react-icons/fa';
import { FaFootball, FaRocket } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { SubscriptionService } from '@/lib/services/subscription.service';
import type { SubscriptionPlan } from '@/types/subscription.types';
import type { ActivePlan } from '@/types/subscription.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

interface DashboardPlansProps {
  activePlan: ActivePlan | null;
  currentPlanName: 'trial' | 'hub' | 'edge' | null;
}

export default function DashboardPlans({ activePlan, currentPlanName }: DashboardPlansProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const allPlans = await SubscriptionService.getPlans();
        // Filter to only show hub and edge plans
        const filteredPlans = allPlans.filter(plan =>
          plan.name === 'hub' || plan.name === 'edge'
        );
        setPlans(filteredPlans);
      } catch (error) {
        console.error('Failed to load plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSubscribe = (planName: string) => {
    router.push(`/checkout?plan=${planName}`);
  };

  // Get plans to display based on current subscription
  const getPlansToDisplay = () => {
    if (currentPlanName === 'trial') {
      // Trial users see Hub and Edge as upgrade options
      return plans.filter(p => p.name === 'hub' || p.name === 'edge');
    } else if (currentPlanName === 'hub') {
      // Hub users see current Hub (disabled) + Edge (upgrade)
      return [
        plans.find(p => p.name === 'hub'),
        plans.find(p => p.name === 'edge')
      ].filter(Boolean) as SubscriptionPlan[];
    } else if (currentPlanName === 'edge') {
      // Edge users see only Edge (current, no upgrade available)
      return [plans.find(p => p.name === 'edge')].filter(Boolean) as SubscriptionPlan[];
    }
    // No plan - show all
    return plans.filter(p => p.name === 'hub' || p.name === 'edge');
  };

  const plansToDisplay = getPlansToDisplay();

  const getPlanDisplayInfo = (plan: SubscriptionPlan) => {
    const isCurrentPlan = !!(currentPlanName === plan.name && activePlan && !activePlan.plan_expired);
    const planTiers: Record<string, number> = { trial: 1, hub: 2, edge: 3 };
    const currentTier = currentPlanName ? planTiers[currentPlanName] : 0;
    const planTier = planTiers[plan.name] || 0;
    const isUpgrade = currentTier > 0 && planTier > currentTier;

    return {
      isCurrent: isCurrentPlan,
      isUpgrade: !!isUpgrade,
      ctaText: isCurrentPlan
        ? 'Current Plan'
        : isUpgrade
          ? `Upgrade to ${plan.display_name}`
          : `Subscribe to ${plan.display_name}`,
      price: `$${plan.price_monthly}/mo`,
      features: getPlanFeatures(plan.name),
      description: plan.description || getPlanDescription(plan.name),
    };
  };

  const getPlanFeatures = (planName: string): string[] => {
    switch (planName) {
      case 'hub':
        return [
          'Hub Starter Content Access',
          'Hub Elite Content Access',
          'Guided Digital Training',
          'Match Insights & Feedback',
          'Structured Independent Improvement',
          'Advanced Training Modules',
        ];
      case 'edge':
        return [
          'Everything in Hub Elite',
          '1:1 UEFA-Level Coaching',
          'Deep Match Insights',
          'Personalised Development Plan',
          'Dedicated Support',
          'Group Mentorship',
          'Career Opportunities',
        ];
      default:
        return [];
    }
  };

  const getPlanDescription = (planName: string): string => {
    switch (planName) {
      case 'hub':
        return 'Access to all Hub content including Starter and Elite levels. A comprehensive training program built to elevate your game through expert digital coaching.';
      case 'edge':
        return 'Elite 1:1 coaching paired with advanced tools to accelerate your development.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (plansToDisplay.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {currentPlanName === 'edge' ? 'Your Current Plan' : 'Available Plans'}
      </h2>
      <div className={`grid grid-cols-1 ${plansToDisplay.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 max-w-5xl mx-auto`}>
        {plansToDisplay.map((plan, index) => {
          const planInfo = getPlanDisplayInfo(plan);
          const isPopular = plan.name === 'edge' && !planInfo.isCurrent;
          const isCurrent = planInfo.isCurrent;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-4 z-10">
                  <span className="bg-gradient-to-r from-[#00FFC2] to-[#00E0AA] text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaCrown className="text-xs" />
                    Current Plan
                  </span>
                </div>
              )}

              <div
                className={`relative bg-gradient-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-xl p-6 border-2 ${isCurrent
                    ? 'border-[#00FFC2] shadow-xl shadow-[#00FFC2]/20'
                    : isPopular
                      ? 'border-yellow-400 shadow-xl shadow-yellow-400/20'
                      : 'border-[#00FFC230]'
                  } hover:border-[#00FFC2] transition-all duration-300 h-full flex flex-col`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.name === 'edge'
                      ? 'from-yellow-400 to-yellow-500'
                      : plan.name === 'hub'
                        ? 'from-[#00FFC2] to-[#00E0AA]'
                        : 'from-green-500 to-green-600'
                    } flex items-center justify-center text-white mb-4`}
                >
                  {plan.name === 'edge' ? (
                    <FaRocket className="w-6 h-6" />
                  ) : (
                    <FaFootball className="w-6 h-6" />
                  )}
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.display_name}</h3>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-3xl font-bold text-white">{planInfo.price}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-4 text-sm">{planInfo.description}</p>

                {/* Features */}
                <div className="flex-1 mb-6">
                  <ul className="space-y-2">
                    {planInfo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheck className="text-green-500 mr-2 mt-1 shrink-0 text-xs" />
                        <span className="text-gray-200 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => !isCurrent && handleSubscribe(plan.name)}
                  disabled={!!isCurrent}
                  className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 ${isCurrent
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : isPopular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-400/30 hover:scale-105 active:scale-95'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95'
                    }`}
                >
                  {isCurrent ? 'Current Plan' : planInfo.ctaText}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

