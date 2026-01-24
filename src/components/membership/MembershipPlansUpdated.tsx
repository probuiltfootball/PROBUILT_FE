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
import footballIcon from "@/assets/figma/Social Media Icon Square/sports_soccer.png";
import rocketIcon from "@/assets/figma/Social Media Icon Square/rocket_launch.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { is } from "zod/locales";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import orange_checkmark from "@/assets/figma/Social Media Icon Square/orange_checkmark.png";

interface PlanFeature {
  text: string;
}

export default function MembershipPlansUpdated() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { SubscriptionEdgeService } =
          await import("@/lib/services/subscription-edge.service");
        const [allPlans, planData] = await Promise.all([
          SubscriptionService.getPlans(),
          isAuthenticated && user
            ? SubscriptionEdgeService.getActivePlan()
            : Promise.resolve(null),
        ]);
        // Filter out hub_starter and hub_elite plans - only show hub and edge
        const filteredPlans = allPlans.filter(
          (plan) => plan.name === "hub" || plan.name === "edge",
        );
        setPlans(filteredPlans);
        setActivePlan(planData);
        // Map ActivePlan to UserSubscription format for backward compatibility
        setCurrentSubscription(
          planData
            ? ({
                plan: planData.plan ? { name: planData.plan } : null,
                status: planData.plan_expired
                  ? "expired"
                  : planData.plan === "trial"
                    ? "trial"
                    : "active",
              } as any)
            : null,
        );
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
      if (planName === "trial") {
        router.push("/signup");
      } else {
        router.push(`/signup?plan=${planName}&redirect=/checkout`);
      }
      return;
    }
    // For authenticated users, trial is already assigned, so redirect to checkout for paid plans
    if (planName === "trial") {
      // If user clicks trial but is authenticated, they might want to sign up again
      // Or we could just redirect to dashboard
      router.push("/dashboard");
    } else {
      router.push(`/checkout?plan=${planName}`);
    }
  };

  // Determine current plan and next available plan
  const currentPlan =
    isAuthenticated && activePlan?.plan && !activePlan?.plan_expired
      ? activePlan.plan
      : null;

  const hasActiveTrial = currentPlan === "trial";
  const hasActiveHub = currentPlan === "hub";
  const hasActiveEdge = currentPlan === "edge";

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
        plans: plans.filter((p) => p.name === "hub" || p.name === "edge"),
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
      plans: plans.filter((p) => p.name === "hub" || p.name === "edge"),
    };
  };

  const { trial, plans: plansToDisplay } = getPlansToDisplay();

  // Define the order of plans for sorting
  const planOrder: Record<string, number> = {
    hub: 1,
    edge: 2,
  };

  // Sort plans so current plan always appears first
  const sortedPlans = [...plansToDisplay].sort((a, b) => {
    const aIsCurrent =
      (activePlan?.plan === a.name && !activePlan?.plan_expired) ||
      currentPlan === a.name;
    const bIsCurrent =
      (activePlan?.plan === b.name && !activePlan?.plan_expired) ||
      currentPlan === b.name;
    if (aIsCurrent && !bIsCurrent) return -1; // a is current, put it first
    if (!aIsCurrent && bIsCurrent) return 1; // b is current, put it first
    return (planOrder[a.name] || 99) - (planOrder[b.name] || 99); // maintain original order if neither or both are current
  });

  const getPlanDisplayInfo = (plan: SubscriptionPlan) => {
    // Check if this plan is the current active plan
    // Use both activePlan and currentPlan for reliability
    const isCurrentPlan =
      (activePlan?.plan === plan.name && !activePlan?.plan_expired) ||
      currentPlan === plan.name;

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
      price: `£${plan.price_monthly}/mo`,
      features: getPlanFeatures(plan.name),
      description: getPlanDescription(plan.name),
    };
  };

  const getPlanFeatures = (planName: string): string[] => {
    switch (planName) {
      case "hub":
        return [
          "Structured training library",
          "Match insights and analysis",
          "Independent improvement programmes",
        ];
      case "edge":
        return [
          "Coach Q&A and feedback",
          "Weekly 1:1 online mentoring",
          "Live webinars and replays",
          "Advanced Edge-only content",
          "Group mentorship",
          "Development opportunities",
        ];
      default:
        return [];
    }
  };

  const getPlanDescription = (planName: string): string => {
    switch (planName) {
      case "hub":
        return "Structured digital training designed to help you train consistently and progress over time.";
      case "edge":
        return "Coach-supported development with mentoring, feedback, and advanced access.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section className="mt-40 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          Compare Our Plans
        </h2>
        <h3 className="text-(--turquoise) text-xl leading-tight">
          Choose how you want to develop — every plan includes full access to the ProBuilt
          training library.
        </h3>
      </motion.div>

      {/* Plans Display */}

      <div className="grid md:grid-cols-[33%_67%] gap-8 justify-center">
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
            >
              {/* {isCurrent && (
                <div className="absolute -top-4 left-4 z-10">
                  <span className="bg-linear-to-r from-[#00FFC2] to-[#00E0AA] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FaCrown />
                    Current Plan
                  </span>
                </div>
              )} */}

              <div
                className={`${plan.name === "edge" ? "border-(--yellow)" : "border-(--turquoise)"} bg-(--card-bg) rounded-2xl p-8 border-2 h-full flex flex-col`}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <Image
                    src={
                      plan.name === "edge"
                        ? rocketIcon
                        : plan.name === "hub"
                          ? footballIcon
                          : ""
                    }
                    alt={plan.name}
                    className="w-18.75"
                  />
                  <div className="flex gap-4">
                    <Button
                      variant={`${plan.name === "edge" ? "tag" : "primary"}`}
                      size="md"
                    >
                      {planInfo.price}
                    </Button>
                    {isPopular && (
                      <Button
                        variant={`${plan.name === "edge" ? "tag" : "primary"}`}
                        size="md"
                      >
                        Most Popular
                      </Button>
                    )}
                  </div>
                </div>

                {/* Plan Name */}
                <h2
                  className={`text-4xl font-semibold mb-3 ${plan.name === "edge" ? "text-(--yellow)" : "text-(--turquoise)"}`}
                >
                  {plan.display_name}
                </h2>

                {/* Description */}
                <p className="mb-9 text-lg">{planInfo.description}</p>

                {/* Features */}
                <div className="flex-1 mb-34">
                  <ul
                    className={`space-y-5 ${plan.name === "edge" && "grid grid-flow-col grid-rows-4 items-start"}`}
                  >
                    {planInfo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Image
                          src={
                            plan.name === "edge"
                              ? orange_checkmark
                              : plan.name === "hub"
                                ? checkmark
                                : ""
                          }
                          alt="check"
                          className="w-5 h-5 mr-3"
                        />
                        <span className="text-[16px]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  variant={`${plan.name === "hub" ? "primary" : "tag"}`}
                  size="lg"
                  onClick={() => !isCurrent && handleSubscribe(plan.name)}
                  disabled={isCurrent}
                  className=""
                >
                  {isCurrent
                    ? "Current Plan"
                    : `Subscribe to ${plan.name.charAt(0).toUpperCase()}${plan.name.slice(1)}`}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
