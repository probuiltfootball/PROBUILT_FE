"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import type { CheckoutData, SubscriptionPlanName } from "@/types/subscription.types";
import { useAppSelector } from "@/lib/store/hooks";

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const plan = searchParams.get("plan");
      router.push(`/login?redirect=/checkout&plan=${plan}`);
      return;
    }

    // Check if user has Edge plan - they should not access checkout
    const checkUserPlan = async () => {
      try {
        const activePlan = await SubscriptionEdgeService.getActivePlan();
        
        // If user has Edge plan, redirect to dashboard (no upgrade available)
        if (activePlan?.plan === 'edge' && !activePlan.plan_expired) {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Failed to check user plan:', err);
      }
    };

    checkUserPlan();

    // Get plan from URL params
    const planParam = searchParams.get("plan") as SubscriptionPlanName;
    const billingPeriod = (searchParams.get("billing") || "monthly") as "monthly" | "yearly";

    if (!planParam || (planParam !== "hub" && planParam !== "edge")) {
      setError("Invalid plan selected. Please choose a valid plan.");
      setLoading(false);
      return;
    }

    // Prepare checkout data
    const prepareCheckout = async () => {
      try {
        const data = await SubscriptionService.prepareCheckout(planParam, billingPeriod);
        setCheckoutData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    prepareCheckout();
  }, [searchParams, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !checkoutData) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error || "Failed to load checkout data"} />
          <button
            onClick={() => router.push("/membership")}
            className="mt-4 w-full bg-[#00FFC2] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00e6b8] transition-colors"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return <CheckoutForm checkoutData={checkoutData} user={user} />;
}

