"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaCrown } from "react-icons/fa";
import { FaFootball, FaRocket } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { SubscriptionService } from "@/lib/services/subscription.service";
import type { SubscriptionPlan, UserSubscription } from "@/types/subscription.types";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface PlanFeature {
  text: string;
}

export default function MembershipPlans() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { SubscriptionEdgeService } = await import('@/lib/services/subscription-edge.service');
        const [allPlans, planData] = await Promise.all([
          SubscriptionService.getPlans(),
          isAuthenticated && user ? SubscriptionEdgeService.getActivePlan() : Promise.resolve(null),
        ]);
        // Filter out hub_starter and hub_elite plans - only show hub and edge
        const filteredPlans = allPlans.filter(plan =>
          plan.name === 'hub' || plan.name === 'edge'
        );
        setPlans(filteredPlans);
        setActivePlan(planData);
        // Map ActivePlan to UserSubscription format for backward compatibility
        setCurrentSubscription(planData ? {
          plan: planData.plan ? { name: planData.plan } : null,
          status: planData.plan_expired ? 'expired' : (planData.plan === 'trial' ? 'trial' : 'active'),
        } as any : null);
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [isAuthenticated, user]);

  const handleSubscribe = (planName: string) => {
    if (!isAuthenticated) {
      // For trial, just redirect to signup (trial is auto-assigned on registration)
      if (planName === 'trial') {
        router.push('/signup');
      } else {
        router.push(`/signup?plan=${planName}&redirect=/checkout`);
      }
      return;
    }
    // For authenticated users, trial is already assigned, so redirect to checkout for paid plans
    if (planName === 'trial') {
      // If user clicks trial but is authenticated, they might want to sign up again
      // Or we could just redirect to dashboard
      router.push('/dashboard');
    } else {
      router.push(`/checkout?plan=${planName}`);
    }
  };

  // Determine current plan and next available plan
  const currentPlan = isAuthenticated && activePlan?.plan && !activePlan?.plan_expired
    ? activePlan.plan
    : null;

  const hasActiveTrial = currentPlan === 'trial';
  const hasActiveHub = currentPlan === 'hub';
  const hasActiveEdge = currentPlan === 'edge';

  // Get plans to display - PUBLIC PAGE: Always show all 3 plans for non-logged-in users
  const getPlansToDisplay = () => {
    // PUBLIC ROUTE: For non-logged-in users, always show all 3 plans (Trial, Hub, Edge)
    if (!isAuthenticated || !user) {
      return {
        trial: {
          show: true,
          label: "Start Free Trial",
          isCurrent: false,
        },
        plans: plans.filter(p => p.name === 'hub' || p.name === 'edge'),
      };
    }

    // If logged in, this page should not be accessible (middleware redirects)
    // But if they somehow reach here, show all plans anyway
    return {
      trial: {
        show: true,
        label: "Start Free Trial",
        isCurrent: false,
      },
      plans: plans.filter(p => p.name === 'hub' || p.name === 'edge'),
    };
  };

  const { trial, plans: plansToDisplay } = getPlansToDisplay();

  // Sort plans so current plan always appears first
  const sortedPlans = [...plansToDisplay].sort((a, b) => {
    const aIsCurrent = (activePlan?.plan === a.name && !activePlan?.plan_expired) || (currentPlan === a.name);
    const bIsCurrent = (activePlan?.plan === b.name && !activePlan?.plan_expired) || (currentPlan === b.name);
    if (aIsCurrent && !bIsCurrent) return -1; // a is current, put it first
    if (!aIsCurrent && bIsCurrent) return 1; // b is current, put it first
    return 0; // maintain original order if neither or both are current
  });

  const getPlanDisplayInfo = (plan: SubscriptionPlan) => {
    // Check if this plan is the current active plan
    // Use both activePlan and currentPlan for reliability
    const isCurrentPlan = (activePlan?.plan === plan.name && !activePlan?.plan_expired) ||
      (currentPlan === plan.name);

    // Determine if this is an upgrade path
    const planTiers: Record<string, number> = { trial: 1, hub: 2, edge: 3 };
    const currentTier = currentPlan ? planTiers[currentPlan] : 0;
    const planTier = planTiers[plan.name] || 0;
    const isUpgrade = currentTier > 0 && planTier > currentTier;

    return {
      isCurrent: isCurrentPlan,
      isUpgrade: !!isUpgrade,
      ctaText: isCurrentPlan
        ? "Current Plan"
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
      case "hub":
        return [
          "Hub Starter Content Access",
          "Hub Elite Content Access",
          "Guided Digital Training",
          "Match Insights & Feedback",
          "Structured Independent Improvement",
          "Advanced Training Modules",
        ];
      case "edge":
        return [
          "Everything in Hub Elite",
          "1:1 UEFA-Level Coaching",
          "Deep Match Insights",
          "Personalised Development Plan",
          "Dedicated Support",
          "Group Mentorship",
          "Career Opportunities",
        ];
      default:
        return [];
    }
  };

  const getPlanDescription = (planName: string): string => {
    switch (planName) {
      case "hub":
        return "Access to all Hub content including Starter and Elite levels. A comprehensive training program built to elevate your game through expert digital coaching.";
      case "edge":
        return "Elite 1:1 coaching paired with advanced tools to accelerate your development.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-300">
          Select the perfect plan to accelerate your football development.
        </p>
      </motion.div>
      {/* Plans Display - Dynamic grid based on number of plans */}
      {/* Render order: Current plan first, then others */}
      <div className={`grid grid-cols-1 ${trial.show && sortedPlans.length === 2
        ? 'md:grid-cols-3' // Trial + Hub + Edge = 3 columns
        : trial.show && sortedPlans.length === 1
          ? 'md:grid-cols-2' // Trial + Hub = 2 columns
          : !trial.show && sortedPlans.length === 2
            ? 'md:grid-cols-2' // Hub + Edge = 2 columns
            : 'md:grid-cols-1' // Single plan = 1 column
        } gap-8 max-w-7xl w-full px-4`}>
        {/* Free Trial - Show first if it's current, otherwise show after paid plans */}
        {trial.show && trial.isCurrent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="relative"
          >
            {trial.isCurrent && (
              <div className="absolute -top-4 left-4 z-10">
                <span className="bg-gradient-to-r from-[#00FFC2] to-[#00E0AA] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <FaCrown />
                  Current Plan
                </span>
              </div>
            )}
            <div className={`relative bg-gradient-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-2xl p-8 border-2 ${trial.isCurrent
              ? "border-[#00FFC2] shadow-2xl shadow-[#00FFC2]/20"
              : "border-[#00FFC230]"
              } hover:border-[#00FFC2] transition-all h-full flex flex-col`}>
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-6">
                <FaFootball className="w-8 h-8" />
              </div>

              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-white mb-2">Free Trial</h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">Free</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 text-lg">Start your journey with 14 days of free access to Hub Starter content.</p>

              {/* Features */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {[
                    "14-Day Free Access",
                    "Hub Starter Content",
                    "All Basic Features",
                    "Cancel Anytime",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => !trial.isCurrent && handleSubscribe("trial")}
                disabled={trial.isCurrent}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${trial.isCurrent
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95"
                  }`}
              >
                {trial.isCurrent ? "Current Plan" : trial.label}
              </button>
            </div>
          </motion.div>
        )}

        {/* Paid Plans */}
        {sortedPlans.map((plan, index) => {
          const planInfo = getPlanDisplayInfo(plan);
          const isPopular = plan.name === "edge" && !planInfo.isCurrent;
          const isCurrent = planInfo.isCurrent;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-[#00FFC2] to-[#00E0AA] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FaCrown />
                    Current Plan
                  </span>
                </div>
              )}

              <div
                className={`relative bg-gradient-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-2xl p-8 border-2 ${isCurrent
                  ? "border-[#00FFC2] shadow-2xl shadow-[#00FFC2]/20"
                  : isPopular
                    ? "border-yellow-400 shadow-2xl shadow-yellow-400/20"
                    : "border-[#00FFC230]"
                  } hover:border-[#00FFC2] transition-all duration-300 h-full flex flex-col`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.name === "edge"
                    ? "from-yellow-400 to-yellow-500"
                    : plan.name === "hub"
                      ? "from-[#00FFC2] to-[#00E0AA]"
                      : "from-green-500 to-green-600"
                    } flex items-center justify-center text-white mb-6`}
                >
                  {plan.name === "edge" ? (
                    <FaRocket className="w-8 h-8" />
                  ) : (
                    <FaFootball className="w-8 h-8" />
                  )}
                </div>

                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-white mb-2">{plan.display_name}</h2>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{planInfo.price}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 text-lg">{planInfo.description}</p>

                {/* Features */}
                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {planInfo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheck className="text-green-500 mr-3 mt-1 shrink-0" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => !isCurrent && handleSubscribe(plan.name)}
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${isCurrent
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : isPopular
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-400/30 hover:scale-105 active:scale-95"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95"
                    }`}
                >
                  {isCurrent ? "Current Plan" : planInfo.ctaText}
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Free Trial - Show last if it's NOT current (for non-logged-in users) */}
        {trial.show && !trial.isCurrent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sortedPlans.length * 0.2 }}
            className="relative"
          >
            <div className={`relative bg-gradient-to-br from-[#2E2E2E] to-[#1a1a1a] rounded-2xl p-8 border-2 ${trial.isCurrent
              ? "border-[#00FFC2] shadow-2xl shadow-[#00FFC2]/20"
              : "border-[#00FFC230]"
              } hover:border-[#00FFC2] transition-all h-full flex flex-col`}>
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-6">
                <FaFootball className="w-8 h-8" />
              </div>

              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-white mb-2">Free Trial</h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">Free</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 text-lg">Start your journey with 14 days of free access to Hub Starter content.</p>

              {/* Features */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {[
                    "14-Day Free Access",
                    "Hub Starter Content",
                    "All Basic Features",
                    "Cancel Anytime",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => !trial.isCurrent && handleSubscribe("trial")}
                disabled={trial.isCurrent}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${trial.isCurrent
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95"
                  }`}
              >
                {trial.isCurrent ? "Current Plan" : trial.label}
              </button>
            </div>
          </motion.div>
        )}


      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 text-center text-gray-400 max-w-2xl mx-auto px-4"
      >
        <p className="text-sm">
          All plans include access to our community platform and can be cancelled
          anytime. Start your free trial today!
        </p>
      </motion.div>
    </div>
  );
}
