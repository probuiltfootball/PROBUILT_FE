'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { FaVideo, FaTrophy, FaCalendar, FaCoins, FaBook, FaLock, FaCheck, FaCrown } from 'react-icons/fa';
import { FaFootball, FaRocket } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SubscriptionCard from './SubscriptionCard';
import { ContentService } from '@/lib/services/content.service';
import { SubscriptionEdgeService } from '@/lib/services/subscription-edge.service';
import { SubscriptionService } from '@/lib/services/subscription.service';
import type { ContentSection } from '@/types/content.types';
import type { SubscriptionPlan, ActivePlan } from '@/types/subscription.types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function PlayerDashboard() {
  const { user, profile, playerProfile } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const basePath = '/dashboard/player';
  const router = useRouter();
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [subscription, setSubscription] = useState<ActivePlan | null>(null);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        // Load subscription and plans
        const [activePlan, plansData] = await Promise.all([
          SubscriptionEdgeService.getActivePlan(),
          SubscriptionService.getPlans(),
        ]);
        setSubscription(activePlan);
        setAllPlans(plansData);

        // Load accessible content
        const sections = await ContentService.getContentSections('hub', user.id);
        setContentSections(sections);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoadingContent(false);
        setLoadingPlans(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const stats = [
    {
      label: 'Pro Points',
      value: playerProfile?.total_pro_points || 0,
      icon: FaCoins,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
    },
    {
      label: 'Videos',
      value: 0, // TODO: Get from API
      icon: FaVideo,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
    },
    {
      label: 'Challenges',
      value: 0, // TODO: Get from API
      icon: FaTrophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/30',
    },
    {
      label: 'Sessions',
      value: 0, // TODO: Get from API
      icon: FaCalendar,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      {process.env.NEXT_PUBLIC_DEBUG_INFO === 'true' && <pre className="text-red-500 bg-amber-200 mb-10">{JSON.stringify(profile, null, 2)}</pre>}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.full_name || 'Player'}!
        </h2>
        <p className="text-gray-400">
          Continue your development journey and track your progress.
        </p>
      </div>

      {/* Subscription Card */}
      {user && <SubscriptionCard userId={user.id} />}

      {/* Subscription Plans Section */}
      {!loadingPlans && (
        <SubscriptionPlansSection
          subscription={subscription}
          allPlans={allPlans}
          onSubscribe={(planName) => router.push(`/checkout?plan=${planName}`)}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-[#2E2E2E] border ${stat.borderColor} rounded-xl p-6 ${stat.bgColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`${stat.color} text-2xl`} />
                <span className={`${stat.color} text-3xl font-bold`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-300 font-medium">{stat.label}</h3>
            </div>
          );
        })}
      </div>

      {/* Content Access */}
      <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaBook />
            Your Content Access
          </h2>
          <div className="flex gap-4">
            <Link
              href="/dashboard/content/hub"
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              Hub Content
            </Link>
            <Link
              href="/dashboard/content/edge"
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              Edge Content
            </Link>
          </div>
        </div>

        {loadingContent ? (
          <div className="text-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hub Starter Content */}
            <div
              className={`p-4 rounded-lg border ${subscription?.plan === 'hub' || subscription?.plan === 'edge'
                ? 'bg-[#1A1A1A] border-[#00FFC230]'
                : 'bg-[#1A1A1A] border-gray-700 opacity-60'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Hub Starter Content</h3>
                  <p className="text-sm text-gray-400">Level 1 training content for Hub Starter subscribers</p>
                  {(subscription?.plan !== 'hub' && subscription?.plan !== 'edge') && (
                    <p className="text-sm text-yellow-400 mt-2 flex items-center gap-1">
                      <FaLock />
                      Upgrade your subscription to access
                    </p>
                  )}
                </div>
                {(subscription?.plan === 'hub' || subscription?.plan === 'edge') ? (
                  <Link
                    href="/dashboard/content/hub"
                    className="px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors text-sm"
                  >
                    View
                  </Link>
                ) : (
                  <Link
                    href="/checkout?plan=hub"
                    className="px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors text-sm"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>


            {/* Existing Content Sections from API */}
            {contentSections.length > 0 && (
              <>
                {contentSections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-lg border ${section.is_locked
                      ? 'bg-[#1A1A1A] border-gray-700 opacity-60'
                      : 'bg-[#1A1A1A] border-[#00FFC230]'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{section.name}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-400">{section.description}</p>
                        )}
                        {section.is_locked && section.lock_reason && (
                          <p className="text-sm text-yellow-400 mt-2 flex items-center gap-1">
                            <FaLock />
                            {section.lock_reason}
                          </p>
                        )}
                      </div>
                      {section.is_locked ? (
                        <Link
                          href="/membership"
                          className="px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors text-sm"
                        >
                          Upgrade
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/content/hub#${section.id}`}
                          className="px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors text-sm"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Videos */}
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Videos</h2>
            <Link
              href={`${basePath}/videos`}
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-8 text-gray-400">
            <FaVideo size={48} className="mx-auto mb-4 opacity-50" />
            <p>No videos yet</p>
            <Link
              href={`${basePath}/videos/upload`}
              className="mt-4 inline-block px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
            >
              Upload Your First Video
            </Link>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Active Challenges</h2>
            <Link
              href={`${basePath}/challenges`}
              className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-8 text-gray-400">
            <FaTrophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active challenges</p>
            <Link
              href={`${basePath}/challenges`}
              className="mt-4 inline-block px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
            >
              Browse Challenges
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Upcoming Sessions</h2>
          <Link
            href={`${basePath}/sessions`}
            className="text-[#00FFC2] hover:text-[#00E0AA] text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-gray-400">
          <FaCalendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>No upcoming sessions</p>
          <Link
            href={`${basePath}/sessions`}
            className="mt-4 inline-block px-4 py-2 bg-[#00FFC2] text-black rounded-lg font-medium hover:bg-[#00E0AA] transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </div>
  );
}

// Subscription Plans Section Component
interface SubscriptionPlansSectionProps {
  subscription: ActivePlan | null;
  allPlans: SubscriptionPlan[];
  onSubscribe: (planName: string) => void;
}

function SubscriptionPlansSection({ subscription, allPlans, onSubscribe }: SubscriptionPlansSectionProps) {
  const currentPlan = subscription?.plan && !subscription?.plan_expired ? subscription.plan : null;
  const hasActiveTrial = currentPlan === 'trial';
  const hasActiveHub = currentPlan === 'hub';
  const hasActiveEdge = currentPlan === 'edge';

  // Get plans to display based on subscription status
  // Note: This component is only shown for logged-in users (inside PlayerDashboard)
  const getPlansToDisplay = () => {
    // Logged in with trial: Show trial (current, disabled) + hub and edge (upgrade, active)
    if (hasActiveTrial) {
      return {
        showTrial: true,
        trialIsCurrent: true,
        plans: allPlans.filter(p => p.name === 'hub' || p.name === 'edge'),
      };
    }

    // Logged in with hub: Show hub (current, disabled) + edge (upgrade, active) - NO trial
    if (hasActiveHub) {
      return {
        showTrial: false,
        trialIsCurrent: false,
        plans: allPlans.filter(p => p.name === 'hub' || p.name === 'edge'),
      };
    }

    // Logged in with edge: Show only edge (current, disabled) - NO other plans
    if (hasActiveEdge) {
      return {
        showTrial: false,
        trialIsCurrent: false,
        plans: allPlans.filter(p => p.name === 'edge'),
      };
    }

    // No active plan but logged in: Show all 3 plans
    return {
      showTrial: true,
      trialIsCurrent: false,
      plans: allPlans.filter(p => p.name === 'hub' || p.name === 'edge'),
    };
  };

  const { showTrial, trialIsCurrent, plans } = getPlansToDisplay();

  // Sort plans so current plan always appears first
  const sortedPlans = [...plans].sort((a, b) => {
    const aIsCurrent = currentPlan === a.name;
    const bIsCurrent = currentPlan === b.name;
    if (aIsCurrent && !bIsCurrent) return -1; // a is current, put it first
    if (!aIsCurrent && bIsCurrent) return 1; // b is current, put it first
    return 0; // maintain original order if neither or both are current
  });

  const getPlanFeatures = (planName: string): string[] => {
    switch (planName) {
      case 'trial':
        return [
          '14-Day Free Access',
          'Hub Starter Content',
          'All Basic Features',
          'Cancel Anytime',
        ];
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
      case 'trial':
        return 'Start your journey with 14 days of free access to Hub Starter content.';
      case 'hub':
        return 'Access to all Hub content including Starter and Elite levels. A comprehensive training program built to elevate your game through expert digital coaching.';
      case 'edge':
        return 'Elite 1:1 coaching paired with advanced tools to accelerate your development.';
      default:
        return '';
    }
  };

  if (!showTrial && plans.length === 0) {
    return null; // Don't show section if no plans to display
  }

  return (
    <div className="bg-[#2E2E2E] border border-[#00FFC230] rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Subscription Plans</h2>

      <div className={`grid grid-cols-1 ${showTrial && sortedPlans.length === 2
        ? 'md:grid-cols-3' // Trial + Hub + Edge = 3 columns
        : showTrial && sortedPlans.length === 1
          ? 'md:grid-cols-2' // Trial + Hub = 2 columns
          : !showTrial && sortedPlans.length === 2
            ? 'md:grid-cols-2' // Hub + Edge = 2 columns
            : 'md:grid-cols-1' // Single plan = 1 column
        } gap-6`}>
        {/* Trial Plan - Show first if it's current */}
        {showTrial && trialIsCurrent && (
          <div className="relative">
            {trialIsCurrent && (
              <div className="absolute -top-3 left-4 z-10">
                <span className="bg-gradient-to-r from-[#00FFC2] to-[#00E0AA] text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <FaCrown className="text-xs" />
                  Current Plan
                </span>
              </div>
            )}
            <div className={`bg-linear-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-xl p-6 border-2 h-full flex flex-col ${trialIsCurrent
              ? 'border-[#00FFC2] shadow-lg shadow-[#00FFC2]/20'
              : 'border-[#00FFC230] hover:border-[#00FFC2]'
              } transition-all`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
                <FaFootball className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free Trial</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">Free</span>
              </div>
              <p className="text-gray-300 mb-4 text-sm">{getPlanDescription('trial')}</p>
              <div className="flex-1 mb-4">
                <ul className="space-y-2">
                  {getPlanFeatures('trial').map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0 text-xs" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => !trialIsCurrent && onSubscribe('trial')}
                disabled={trialIsCurrent}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${trialIsCurrent
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                  }`}
              >
                {trialIsCurrent ? 'Current Plan' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        )}

        {/* Paid Plans - Current plan will be first due to sorting */}
        {sortedPlans.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          const isPopular = plan.name === 'edge' && !isCurrent;

          return (
            <div key={plan.id} className="relative">
              {isPopular && (
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
              <div className={`bg-linear-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-xl p-6 border-2 h-full flex flex-col ${isCurrent
                ? 'border-[#00FFC2] shadow-lg shadow-[#00FFC2]/20'
                : isPopular
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'border-[#00FFC230] hover:border-[#00FFC2]'
                } transition-all`}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.name === 'edge'
                  ? 'from-yellow-400 to-yellow-500'
                  : 'from-[#00FFC2] to-[#00E0AA]'
                  } flex items-center justify-center text-white mb-4`}>
                  {plan.name === 'edge' ? (
                    <FaRocket className="w-6 h-6" />
                  ) : (
                    <FaFootball className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.display_name}</h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-white">${plan.price_monthly}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <p className="text-gray-300 mb-4 text-sm">{plan.description || getPlanDescription(plan.name)}</p>
                <div className="flex-1 mb-4">
                  <ul className="space-y-2">
                    {getPlanFeatures(plan.name).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0 text-xs" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => !isCurrent && onSubscribe(plan.name)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${isCurrent
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : isPopular
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.display_name}`}
                </button>
              </div>
            </div>
          );
        })}

        {/* Trial Plan - Show last if it's NOT current (for non-logged-in users) */}
        {showTrial && !trialIsCurrent && (
          <div className="relative">
            <div className={`bg-linear-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-xl p-6 border-2 h-full flex flex-col ${trialIsCurrent
              ? 'border-[#00FFC2] shadow-lg shadow-[#00FFC2]/20'
              : 'border-[#00FFC230] hover:border-[#00FFC2]'
              } transition-all`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
                <FaFootball className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free Trial</h3>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">Free</span>
              </div>
              <p className="text-gray-300 mb-4 text-sm">{getPlanDescription('trial')}</p>
              <div className="flex-1 mb-4">
                <ul className="space-y-2">
                  {getPlanFeatures('trial').map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0 text-xs" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => !trialIsCurrent && onSubscribe('trial')}
                disabled={trialIsCurrent}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${trialIsCurrent
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                  }`}
              >
                {trialIsCurrent ? 'Current Plan' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

