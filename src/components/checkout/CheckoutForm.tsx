"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheck, FaLock, FaCreditCard } from "react-icons/fa6";
import { User } from "@supabase/supabase-js";
import type { CheckoutData, SubscriptionPlan } from "@/types/subscription.types";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import SuccessMessage from "@/components/shared/SuccessMessage";

interface CheckoutFormProps {
  checkoutData: CheckoutData;
  user: User | null;
}

export default function CheckoutForm({ checkoutData, user }: CheckoutFormProps) {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    checkoutData.billingPeriod
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [planData, setPlanData] = useState<SubscriptionPlan | null>(null);

  // Fetch plan data to get actual prices
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const plan = await SubscriptionService.getPlanByName(checkoutData.planName);
        if (plan) {
          setPlanData(plan);
        }
      } catch (err) {
        console.error('Failed to fetch plan data:', err);
      }
    };
    fetchPlanData();
  }, [checkoutData.planName]);

  // Calculate prices based on billing period and plan data
  const plan = checkoutData.planName === "hub" ? "Hub" : "Edge";
  const monthlyPrice = planData?.price_monthly || checkoutData.price;
  const yearlyPrice = planData?.price_yearly || (monthlyPrice * 12);
  const displayPrice = billingPeriod === "yearly" ? yearlyPrice : monthlyPrice;
  const savings = billingPeriod === "yearly" ? (monthlyPrice * 12) - yearlyPrice : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      // Check current plan - only allow upgrade from trial/free or hub
      const activePlan = await SubscriptionEdgeService.getActivePlan();
      
      // Prevent Edge users from accessing checkout (should be handled by CheckoutPageContent, but double-check)
      if (activePlan?.plan === 'edge' && !activePlan.plan_expired) {
        throw new Error("You already have the highest tier subscription. No upgrade available.");
      }

      // Subscribe to the plan with the selected billing period
      // This will update the user's subscription via backend call
      const planName = checkoutData.planName as 'hub' | 'edge';
      await SubscriptionEdgeService.subscribePlan(planName, billingPeriod);

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process subscription");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC2]"
        >
          <SuccessMessage message="Subscription activated successfully! Redirecting to dashboard..." />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Subscribe to {plan}
          </h1>
          <p className="text-gray-300 text-lg">
            Choose your billing period and confirm your subscription
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC230]"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              {/* Plan Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">
                  Billing Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod("monthly")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      billingPeriod === "monthly"
                        ? "border-[#00FFC2] bg-[#00FFC210]"
                        : "border-[#00FFC230] hover:border-[#00FFC250]"
                    }`}
                  >
                    <div className="text-white font-semibold">Monthly</div>
                    <div className="text-gray-400 text-sm">
                      ${monthlyPrice.toFixed(2)}/mo
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPeriod("yearly")}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      billingPeriod === "yearly"
                        ? "border-[#00FFC2] bg-[#00FFC210]"
                        : "border-[#00FFC230] hover:border-[#00FFC250]"
                    }`}
                  >
                    <div className="text-white font-semibold">Yearly</div>
                    <div className="text-gray-400 text-sm">
                      ${yearlyPrice.toFixed(2)}/yr
                    </div>
                    {savings > 0 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                        Save ${savings.toFixed(2)}
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Plan Details */}
              <div className="border-t border-[#00FFC230] pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      ProBuilt: {plan}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {billingPeriod === "yearly" ? "Yearly" : "Monthly"} billing
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${displayPrice.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {billingPeriod === "yearly" ? "per year" : "per month"}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  <div className="text-gray-300 font-medium mb-2">Includes:</div>
                  {checkoutData.planName === "hub" ? (
                    <>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Guided Digital Training</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Match Insights & Feedback</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Structured Independent Improvement</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>14-Day Free Trial</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>1:1 UEFA-Level Coaching</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Deep Match Insights</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Personalised Development Plan</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Dedicated Support</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Group Mentorship</span>
                      </div>
                      <div className="flex items-center text-gray-200">
                        <FaCheck className="text-green-500 mr-3" />
                        <span>Career Opportunities</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC230] sticky top-24"
            >
              <div className="flex items-center mb-6">
                <FaLock className="text-[#00FFC2] mr-2" />
                <span className="text-white font-semibold">Secure Checkout</span>
              </div>

              {error && (
                <div className="mb-4">
                  <ErrorMessage message={error} />
                </div>
              )}

              {/* Total */}
              <div className="border-t border-[#00FFC230] pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-semibold">
                    ${displayPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#00FFC2] text-2xl">
                    ${displayPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit/Pay Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="mr-2" />
                    Pay
                  </>
                )}
              </button>

              <p className="text-gray-400 text-xs text-center mt-4">
                Your subscription will be activated immediately. Cancel anytime.
              </p>

              <button
                type="button"
                onClick={() => router.push("/membership")}
                className="w-full mt-4 text-gray-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Plans
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}

