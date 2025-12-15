"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import EdgeSection from "@/components/edge-section";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheck, FaRocket, FaUserTie, FaChartBar, FaUsers } from "react-icons/fa6";
import { useAppSelector } from "@/lib/store/hooks";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import type { ActivePlan } from "@/types/subscription.types";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function EdgePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivePlan = async () => {
      // Only call API if user is authenticated
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const plan = await SubscriptionEdgeService.getActivePlan();
        setActivePlan(plan);
        
        // Redirect to dashboard if user has active subscription (per spec: public pages hidden after login)
        if (plan?.plan && !plan.is_expired) {
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Failed to load active plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivePlan();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-44 md:pt-48 pb-20 top-hero-section px-6 bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] min-h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <FaRocket className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              ProBuilt Edge
            </h1>
          </motion.div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Elite 1:1 coaching paired with advanced tools to accelerate your development.
          </p>
          {isAuthenticated && activePlan?.plan ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/membership"
                className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
              >
                View Plans
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?plan=trial"
                className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/membership"
                className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Edge Section from Landing Page */}
      <EdgeSection />

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Elite Coaching Experience
            </h2>
            <p className="text-xl text-gray-300">
              Get personalized attention from UEFA-licensed coaches
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaUserTie,
                title: "1:1 Coaching",
                description: "Personalized sessions with UEFA-level coaches",
              },
              {
                icon: FaChartBar,
                title: "Deep Insights",
                description: "Advanced match analysis and performance metrics",
              },
              {
                icon: FaUsers,
                title: "Group Mentorship",
                description: "Learn alongside other elite players",
              },
              {
                icon: FaRocket,
                title: "Career Support",
                description: "Get guidance on your football career path",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#2E2E2E] rounded-xl p-8 border border-yellow-400/30"
                >
                  <Icon className="w-12 h-12 text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#2E2E2E] to-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Edge Plan
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              The ultimate coaching experience for serious players
            </p>

            <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-yellow-400">
              <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                Premium Plan
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">ProBuilt Edge</h3>
              <div className="text-5xl font-bold text-yellow-400 mb-6">$59.99<span className="text-xl text-gray-400">/mo</span></div>
              <ul className="space-y-4 text-left mb-8">
                {[
                  "Everything in Hub Elite",
                  "1:1 UEFA-Level Coaching",
                  "Deep Match Insights",
                  "Personalised Development Plan",
                  "Dedicated Support",
                  "Group Mentorship",
                  "Career Opportunities",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/membership"
                className="block w-full py-4 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors text-center text-lg"
              >
                Subscribe to Edge
              </Link>
            </div>

            <div className="text-gray-400 text-sm mt-8">
              <p>All plans include a 14-day free trial. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-2 border-yellow-400 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready for Elite Coaching?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Take your game to the next level with personalized 1:1 coaching
            </p>
            {isAuthenticated && activePlan?.plan ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/membership"
                  className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
                >
                  View Plans
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup?plan=trial"
                  className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/membership"
                  className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
                >
                  View Plans
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
