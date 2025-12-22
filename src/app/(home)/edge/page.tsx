"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import edge_hero_image from "@/assets/figma/Edge_dashboard/Edge_hero.png";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/divider";
import tag from "@/assets/figma/Tags/most_popular.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import edge_image from "@/assets/figma/edge_landing_page.png";
import edge_exclusive_image from "@/assets/figma/Edge_dashboard/Edge_exclusive.png";
import edge_community_image from "@/assets/figma/Edge_dashboard/Edge_community.png";
import BG1 from "@/assets/figma/Edge_dashboard/BG1.png";
import BG2 from "@/assets/figma/Edge_dashboard/BG2.png";
import BG3 from "@/assets/figma/Edge_dashboard/BG3.png";

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
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Failed to load active plan:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivePlan();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen text-(--secondary)">
      <Navbar />

      {/* Hero Section */}
      <section className="top-hero-section flex items-center justify-between mt-42 mb-16 lg:mx-22 md:mx-20 sm:mx-10 mx-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-3 leading-22 max-w-200">
              <span className="text-(--accent)">Edge:</span> Your Personalised Training
              Experience
            </h1>
            <p className="text-xl mb-15.75 text-(--accent) max-w-lg">
              A personalised, UEFA-coach-built plan tailored to your position, strengths,
              and long-term ambition.
            </p>
          </motion.div>
          {isAuthenticated && activePlan?.plan ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Start Next Session
                </Button>
              </Link>
              <Link href="/membership">
                <Button variant="secondary" size="lg">
                  Go to your Plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup?plan=trial">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/membership">
                <Button variant="secondary" size="lg">
                  View Plans
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div>
          <Image src={edge_hero_image} alt="Edge Coaching" />
        </div>
      </section>

      <Divider />

      {/* Upcoming Session */}
      <motion.div className="my-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Edge: Individual Coaching Needs</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            A personalised, UEFA-coach-built plan tailored to your position, strengths,
            and long-term ambition.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="flex flex-col md:flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
          <div>
            <Image
              src={edge_image}
              alt="Edge Landing 1"
              className="rounded-xl object-fill"
            />
          </div>
          <div className="flex flex-col gap-7">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button variant="tag" size="lg">
                Assigned Drill
              </Button>
            </motion.div>
            <h2 className="text-4xl">
              Positional Awareness: Attacking Midfield - Week 1
            </h2>
            <ul className="grid grid-cols-2 gap-y-5 gap-x-8">
              <div className="flex flex-col gap-5">
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>1 Tactical breakdown</span>
                </li>
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>1 Technical assignment</span>
                </li>
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>1 Mindset framework</span>
                </li>
              </div>
              <div className="flex flex-col gap-5">
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>1 Conditioning session</span>
                </li>
              </div>
            </ul>
            <motion.div
              className="flex flex-row md:gap-4 gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/edge-session">
                  <Button variant="primary" size="lg" className="flex-1">
                    Start Session
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/learn-more">
                  <Button variant="secondary" size="lg" className="flex-1">
                    Module Overview
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Divider />

      {/* Edge Exclusive */}

      <motion.div className="my-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Individual Player Plan</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            A weekly updated, personalised pathway built around your role, ability, and
            goals.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="flex flex-col md:flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
          <div className="flex flex-col gap-7">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button variant="tag" size="lg">
                Edge Exclusive
              </Button>
            </motion.div>
            <h2 className="text-4xl">Weekly Focus: Your Coach's Key Priorities</h2>
            <ul className="flex flex-col gap-5">
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>Scanning & Body Orientation</span>
              </li>
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>First-Touch Under Pressure</span>
              </li>
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>Decision-Making Tempo</span>
              </li>
            </ul>
            <motion.div
              className="flex flex-row md:gap-4 gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/edge-session">
                  <Button variant="primary" size="lg" className="flex-1">
                    View Priorities
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div>
            <Image
              src={edge_exclusive_image}
              alt="Edge Exclusive"
              className="rounded-xl object-fill opacity-80"
            />
          </div>
        </div>
      </motion.div>

      <Divider />
      {/* Opportunities and Trials */}
      <motion.div className="my-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Exclusive Opportunities & Trials</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            Edge athletes get exclusive access to growing opportunities as their PB Points
            increase.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col justify-center items-center gap-7.75 bg-[#27272E] rounded-3xl px-8.25 py-14 border-(--accent) border-2">
            <Image src={BG1} alt="BG1" />
            <h3 className="text-[28px] font-semibold">Trial Access</h3>
            <p className="text-[20px] text-center text-(--accent)">
              Get priority invitations to partner clubs and scouting opportunities.
            </p>
            <Link href="/learn-more">
              <Button variant="primary" size="md">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-7.75 bg-[#27272E] rounded-3xl px-8.25 py-14 border-(--accent) border-2">
            <Image src={BG2} alt="BG2" />
            <h3 className="text-[28px] font-semibold">Mentor Sessions</h3>
            <p className="text-[20px] text-center text-(--accent)">
              Join targeted small-group sessions led by ProBuilt coaches.
            </p>
            <Link href="/learn-more">
              <Button variant="primary" size="md">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-7.75 bg-[#27272E] rounded-3xl px-8.25 py-14 border-(--accent) border-2">
            <Image src={BG3} alt="BG3" />
            <h3 className="text-[28px] font-semibold">Trial Access</h3>
            <p className="text-[20px] text-center text-(--accent)">
              Positional and tactical modules for personal player development.
            </p>
            <Link href="/learn-more">
              <Button variant="primary" size="md">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <Divider />

      {/* Community Section */}
      <motion.div className="mt-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Join The ProBuilt Community</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            Connect with driven players, share progress, and learn from coaches in a
            community built to support your development.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="flex flex-col md:flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
          <div>
            <Image
              src={edge_community_image}
              alt="Edge Landing 1"
              className="rounded-xl object-fill"
            />
          </div>
          <div className="flex flex-col gap-7">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button variant="tag" size="lg">
                Community
              </Button>
            </motion.div>
            <h2 className="text-4xl">
              Positional Awareness: Attacking Midfield - Week 1
            </h2>
            <ul className="grid grid-cols-2 gap-y-5 gap-x-8">
              <div className="flex flex-col gap-5">
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>Player discussion threads</span>
                </li>
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>Progress sharing</span>
                </li>
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>Group challenges</span>
                </li>
              </div>
              <div className="flex flex-col gap-5">
                <li className="flex">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                  <span>Q&A with Coaches</span>
                </li>
              </div>
            </ul>
            <motion.div
              className="flex flex-row md:gap-4 gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/edge-community">
                  <Button variant="primary" size="lg" className="flex-1">
                    Join Community
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      {/* <section className="py-20 px-6 bg-[#1a1a1a]">
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
      </section> */}

      {/* Plan Section */}
      {/* <section className="py-20 px-6 bg-linear-to-b from-[#2E2E2E] to-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Edge Plan</h2>
            <p className="text-xl text-gray-300 mb-12">
              The ultimate coaching experience for serious players
            </p>

            <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-yellow-400">
              <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                Premium Plan
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">ProBuilt Edge</h3>
              <div className="text-5xl font-bold text-yellow-400 mb-6">
                $59.99<span className="text-xl text-gray-400">/mo</span>
              </div>
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
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-6 bg-[#1a1a1a]">
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
      </section> */}

      <Footer />
    </main>
  );
}
