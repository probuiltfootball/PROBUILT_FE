"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import HubSection from "@/components/hub-section";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheck, FaPlay, FaBook, FaChartLine } from "react-icons/fa6";
import { useAppSelector } from "@/lib/store/hooks";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import type { ActivePlan } from "@/types/subscription.types";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function HubPage() {
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

  // If user has active subscription, they should be redirected (handled above)
  // But show page if redirect hasn't happened yet

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
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              ProBuilt Hub
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your Digital Training Ground. Elevate your game through expert digital coaching.
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/content/hub"
                  className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
                >
                  Access My Hub Content
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
                  href="/signup"
                  className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
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

      {/* Hub Section from Landing Page */}
      <HubSection />

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
              What You'll Get
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to develop your football skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaPlay,
                title: "Video Training",
                description: "Access hundreds of training videos from expert coaches",
              },
              {
                icon: FaBook,
                title: "Guided Programs",
                description: "Follow structured training programs designed for your level",
              },
              {
                icon: FaChartLine,
                title: "Track Progress",
                description: "Monitor your development and see your improvement over time",
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
                  className="bg-[#2E2E2E] rounded-xl p-8 border border-[#00FFC230]"
                >
                  <Icon className="w-12 h-12 text-[#00FFC2] mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#2E2E2E] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Hub Plan
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Start with a free trial, then choose the plan that fits your goals
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-[#00FFC230]">
                <h3 className="text-2xl font-bold text-white mb-2">Hub Starter</h3>
                <div className="text-4xl font-bold text-[#00FFC2] mb-4">$29.99<span className="text-lg text-gray-400">/mo</span></div>
                <ul className="space-y-3 text-left mb-6">
                  {[
                    "Guided Digital Training",
                    "Match Insights & Feedback",
                    "Structured Independent Improvement",
                    "Hub Starter Content Access",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/membership"
                  className="block w-full py-3 rounded-lg bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>

              <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-yellow-400">
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Hub Elite</h3>
                <div className="text-4xl font-bold text-yellow-400 mb-4">$49.99<span className="text-lg text-gray-400">/mo</span></div>
                <ul className="space-y-3 text-left mb-6">
                  {[
                    "Everything in Hub Starter",
                    "Hub Elite Content Access",
                    "Advanced Training Modules",
                    "Priority Support",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/membership"
                  className="block w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="text-gray-400 text-sm">
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
            className="bg-gradient-to-r from-[#00FFC2]/10 to-[#00E0AA]/10 border-2 border-[#00FFC2] rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of players developing their skills with ProBuilt Hub
            </p>
            {isAuthenticated && activePlan?.plan ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
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
                  className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
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
