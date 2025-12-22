"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/divider";
import hub_hero_image from "@/assets/figma/Hub_Dashboard/HeroImage.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import session_image from "@/assets/figma/Hub_Dashboard/SessionImage.png";
import edge_community_image from "@/assets/figma/Edge_dashboard/Edge_community.png";
import ImageIcon from "@/assets/figma/Hub_Dashboard/Image icon.png";
import LeftArrowIcon from "@/assets/figma/Hub_Dashboard/Chevron Left.png";
import RightArrowIcon from "@/assets/figma/Hub_Dashboard/Chevron Right.svg";

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

  const trainingLibraryCards = [
    { title: "Strikers", image: ImageIcon },
    { title: "Midfielders", image: ImageIcon },
    { title: "Defenders", image: ImageIcon },
    { title: "Goalkeepers", image: ImageIcon },
  ];

  // Ref for the card container
  const cardSliderRef = useRef<HTMLDivElement>(null);

  // Card width + gap (px)
  const CARD_WIDTH = 515.35;
  const CARD_GAP = 32;

  const handleScroll = (direction: "left" | "right") => {
    if (!cardSliderRef.current) return;
    const scrollAmount = CARD_WIDTH + CARD_GAP;
    cardSliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user has active subscription, they should be redirected (handled above)
  // But show page if redirect hasn't happened yet

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
              <span className="text-(--accent)">Hub:</span> Your Digital Performance Hub
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
          <Image src={hub_hero_image} alt="Hub Coaching" />
        </div>
      </section>

      <Divider />

      {/* Sessions Section */}

      <motion.div className="my-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Today’s Session</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            Complete this to maintain your streak and earn PB Points.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="flex flex-col md:flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
          <div>
            <Image
              src={session_image}
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
                Weekly Focus
              </Button>
            </motion.div>
            <h2 className="text-4xl">Shooting: Finishing from Central Areas</h2>
            <ul className="space-y-4">
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>Improve finishing accuracy from central areas </span>
              </li>
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>Sharpen shot selection under pressure</span>
              </li>
              <li className="flex">
                <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
                <span>Apply techniques in match-realistic drills</span>
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
                    Start Session
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/learn-more">
                  <Button variant="secondary" size="lg" className="flex-1">
                    Session Details
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Divider />

      {/* Performance Section */}

      <motion.div className="my-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Your Performance Progress</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            See how your consistency is building momentum.
          </h3>
        </motion.div>

        {/* Card */}
        <div className="flex flex-col items-start gap-15 bg-[#27272E] rounded-[30px] p-21.25">
          <div className="flex justify-between w-full">
            <div className="flex-1 gap-7 flex flex-col">
              <h3 className="text-[28px]">Performance Progress</h3>
              <ul className="space-y-7">
                <li>
                  <span className="text-(--accent)">1,200 </span>
                  PB Points
                </li>
                <li>
                  <span className="text-(--accent)">+85 </span>Earned This Week
                </li>
              </ul>
            </div>
            <div className="flex-1 gap-7 flex flex-col">
              <h3 className="text-[28px]">Today’s Focus</h3>
              <ul className="space-y-7">
                <li className="flex items-center">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-3" />
                  Earn points through training and engagement.
                </li>
                <li className="flex items-center">
                  <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-3" />
                  Complete Shooting: Finishing from Central Areas.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-[23.25px]">
            <h3 className="text-[28px]">
              Next reward:
              <span className="text-(--accent)"> Group Mentor Session</span>{" "}
            </h3>
            <div>PROGRESS BAR</div>
            <div>
              <span>38,00</span> PB to go
            </div>
            <Link href="/session" className="mt-4">
              <Button variant="primary" size="lg">
                Start Next Session
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <Divider />

      {/* Training Library */}
      <motion.div className="my-14 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-medium mb-3">Training Library</h2>
          <h3 className="text-xl leading-tight text-(--accent)">
            Choose how you want to develop your football skills.
          </h3>
        </motion.div>

        {/* Card */}

        <div className=" w-full">
          <div
            ref={cardSliderRef}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-7"
            style={{
              scrollSnapType: "x mandatory",
              width: "calc(2.65 * 516px + 1.5 * 32px)", // 2.5 cards + 2 gaps
              scrollbarColor: "transparent transparent",
            }}
          >
            {trainingLibraryCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#27272E] h-162.5 w-[515.35px] relative flex items-center justify-center rounded-[20px] flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Image src={card.image} alt={`${card.title} Icon`} />
                </div>
                <span className="absolute bottom-6 left-6">{card.title}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between ">
            <div>
              <h4 className="text-[36px]">Choose Your Focus Area</h4>
              <p className="text-(--accent)">
                Select a skill or position to explore targeted sessions that support your
                overall development.
              </p>
            </div>
            <div className="flex gap-7">
              <button onClick={() => handleScroll("left")}>
                <Image
                  src={LeftArrowIcon}
                  alt="Left"
                  width={50}
                  className="rounded-full bg-(--accent) p-2 cursor-pointer"
                />
              </button>
              <button onClick={() => handleScroll("right")}>
                <Image
                  src={RightArrowIcon}
                  alt="Right"
                  width={50}
                  className="rounded-full bg-(--accent) p-2 cursor-pointer"
                />
              </button>
            </div>
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
                description:
                  "Follow structured training programs designed for your level",
              },
              {
                icon: FaChartLine,
                title: "Track Progress",
                description:
                  "Monitor your development and see your improvement over time",
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
      </section> */}

      {/* Plans Section */}
      {/* <section className="py-20 px-6 bg-linear-to-b from-[#2E2E2E] to-[#1a1a1a]">
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
                <div className="text-4xl font-bold text-[#00FFC2] mb-4">
                  $29.99<span className="text-lg text-gray-400">/mo</span>
                </div>
                <ul className="space-y-3 text-left mb-6">
                  {[
                    "Guided Digital Training",
                    "Match Insights & Feedback",
                    "Structured Independent Improvement",
                    "Hub Starter Content Access",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 shrink-0" />
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
                <div className="text-4xl font-bold text-yellow-400 mb-4">
                  $49.99<span className="text-lg text-gray-400">/mo</span>
                </div>
                <ul className="space-y-3 text-left mb-6">
                  {[
                    "Everything in Hub Starter",
                    "Hub Elite Content Access",
                    "Advanced Training Modules",
                    "Priority Support",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 shrink-0" />
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
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-linear-to-r from-[#00FFC2]/10 to-[#00E0AA]/10 border-2 border-[#00FFC2] rounded-2xl p-12"
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
      </section> */}

      <Footer />
    </main>
  );
}
