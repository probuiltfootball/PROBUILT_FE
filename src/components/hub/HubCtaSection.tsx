"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface HubCtaSectionProps {
  isAuthenticated: boolean;
  userLevel?: string; // Legacy prop, kept for compatibility
  userId?: string | null;
  router: ReturnType<typeof useRouter>;
}

export default function HubCtaSection({ isAuthenticated, router }: HubCtaSectionProps) {
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
        className="mt-12 text-center bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC2]"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Unlock All Hub Content
        </h3>
        <p className="text-gray-300 mb-6">
          Sign up for a free trial and get access to Hub content immediately!
        </p>
        <button
          onClick={() => router.push("/signup?plan=trial")}
          className="bg-[#00FFC2] text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#00e6b8] transition-colors"
        >
          Start Free Trial
        </button>
      </motion.div>
    );
  }

  // User has Hub plan - show edge upgrade
  if (isAuthenticated && ctaVisibility.showEdge && !ctaVisibility.showHub) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center bg-[#2E2E2E] rounded-2xl p-8 border-2 border-yellow-400"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Unlock Edge - The Ultimate Experience
        </h3>
        <p className="text-gray-300 mb-6">
          Get 1:1 coaching, personalized development plans, and exclusive career opportunities.
        </p>
        <button
          onClick={() => router.push("/membership?plan=edge")}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors"
        >
          Upgrade to Edge
        </button>
      </motion.div>
    );
  }

  // Edge users - no CTA needed
  if (isAuthenticated && !ctaVisibility.showEdge && !ctaVisibility.showHub && !ctaVisibility.showTrial) {
    return null;
  }

  // Trial or free user - show hub subscription
  if (ctaVisibility.showHub) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-12 text-center bg-[#2E2E2E] rounded-2xl p-8 border-2 border-[#00FFC2]"
    >
      <h3 className="text-2xl font-bold text-white mb-4">
        Unlock Hub Content
      </h3>
      <p className="text-gray-300 mb-6">
          Subscribe to Hub to access all training content and start your development journey.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
            onClick={() => router.push("/membership?plan=hub")}
          className="bg-[#00FFC2] text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#00e6b8] transition-colors"
        >
          View Plans
        </button>
        {isAuthenticated && (
          <button
              onClick={() => router.push("/dashboard")}
            className="border border-[#00FFC2] text-[#00FFC2] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#00FFC2]/10 transition-colors"
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

