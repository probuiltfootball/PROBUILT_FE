"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface EdgeCtaSectionProps {
  isAuthenticated: boolean;
  userLevel?: string; // Legacy prop, kept for compatibility
  userId?: string | null;
  router: ReturnType<typeof useRouter>;
}

export default function EdgeCtaSection({ isAuthenticated, router }: EdgeCtaSectionProps) {
  const [ctaVisibility, setCtaVisibility] = useState<{
    showTrial: boolean;
    showHub: boolean;
    showEdge: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCtaVisibility = async () => {
      // If not authenticated, show all CTAs (guest state)
      if (!isAuthenticated) {
        setCtaVisibility({ showTrial: true, showHub: true, showEdge: true });
        setLoading(false);
        return;
      }

      try {
        const visibility = await SubscriptionEdgeService.getCtaVisibility();
        setCtaVisibility(visibility);
      } catch (error) {
        console.error("Failed to load CTA visibility:", error);
        // Default to showing all CTAs on error
        setCtaVisibility({ showTrial: true, showHub: true, showEdge: true });
      } finally {
        setLoading(false);
      }
    };

    loadCtaVisibility();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!ctaVisibility) {
    return null;
  }

  // Not authenticated - show free trial CTA
  if (!isAuthenticated && ctaVisibility.showTrial) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center bg-[#2E2E2E] rounded-2xl p-8 border-2 border-yellow-500"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Unlock Elite Edge Content
        </h3>
        <p className="text-gray-300 mb-6">
          Subscribe to Edge plan and get access to 1:1 UEFA-Level Coaching and exclusive content!
        </p>
        <button
          onClick={() => router.push("/signup?plan=trial")}
          className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
        >
          Start Free Trial
        </button>
      </motion.div>
    );
  }

  // Edge users - no CTA needed
  if (isAuthenticated && !ctaVisibility.showEdge && !ctaVisibility.showHub && !ctaVisibility.showTrial) {
    return null;
  }

  // User can upgrade to edge - show upgrade CTA
  if (ctaVisibility.showEdge) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center bg-[#2E2E2E] rounded-2xl p-8 border-2 border-yellow-500"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Unlock Edge - The Ultimate Experience
        </h3>
        <p className="text-gray-300 mb-6">
          Get 1:1 UEFA-Level Coaching, personalized development plans, and exclusive career opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
            onClick={() => router.push("/membership?plan=edge")}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors"
        >
            Upgrade to Edge
        </button>
        {isAuthenticated && (
          <button
              onClick={() => router.push("/dashboard")}
            className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500/10 transition-colors"
          >
            View My Content
          </button>
        )}
      </div>
    </motion.div>
  );
  }

  return null;
}

