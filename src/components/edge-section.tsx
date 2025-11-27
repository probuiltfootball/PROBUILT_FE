"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import imgEdgeLanding1 from "@/assets/jpeg/img-edge-landing1.jpeg";
import imgEdgeLanding2 from "@/assets/jpeg/img-edge-landing2.jpeg";

export default function EdgeSection() {
    return (
        <section className="pb-20 px-6 ">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[#00FFC2] text-xl font-medium mb-4">
                        Welcome to Edge
                    </h2>
                    <h3 className="text-white text-4xl md:text-5xl font-bold">
                        In-Person Elite Football Coaching.
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-[#2E2E2E80] rounded-3xl border border-[#00FFC270] overflow-hidden flex flex-col h-[640px]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 0 30px rgba(0, 255, 194, 0.3)",
                            transition: { duration: 0.3 }
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="p-8 md:p-12" style={{ height: "294px" }}>
                            <h4 className="text-white text-3xl font-bold mb-4">
                                Expert Coaching, Real Results
                            </h4>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Train with UEFA-qualified coaches who turn the game into clear,
                                actionable steps that accelerate your development.
                            </p>
                            <Link
                                href="/"
                                className="text-[#00FFC2] text-lg font-medium flex items-center gap-2 hover:gap-3 transition-all"
                            >
                                Join Edge
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 12H19M19 12L12 5M19 12L12 19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div className="relative flex-1">
                            <Image
                                src={imgEdgeLanding1}
                                alt="Stadium"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-[#2E2E2E80] rounded-3xl border border-[#00FFC270] overflow-hidden flex flex-col h-[640px]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 0 30px rgba(0, 255, 194, 0.3)",
                            transition: { duration: 0.3 }
                        }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="p-8 md:p-12" style={{ height: "294px" }}>
                            <h4 className="text-white text-3xl font-bold mb-4">
                                Better Decisions, Every Match
                            </h4>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Get real-time feedback from your coaches during drills and game
                                scenarios, helping you correct mistakes faster and build smarter
                                habits.
                            </p>
                            <Link
                                href="/"
                                className="text-[#00FFC2] text-lg font-medium flex items-center gap-2 hover:gap-3 transition-all"
                            >
                                See How it Works
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 12H19M19 12L12 5M19 12L12 19"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div className="relative flex-1">
                            <Image
                                src={imgEdgeLanding2}
                                alt="Stadium"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
