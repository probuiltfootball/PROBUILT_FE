"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import imgHubLanding from "@/assets/jpeg/img-hub-landing.jpg";
export default function HubSection() {
    return (
        <section className="pb-20 px-6 ">
            <div className="max-w-[1280px] mx-auto">

                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="text-[#00FFC2] text-xl font-medium mb-2">
                        Welcome to Hub
                    </h2>
                    <h3 className="text-white text-4xl md:text-5xl font-bold leading-tight">
                        Your Digital Training Ground.
                    </h3>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] overflow-hidden flex flex-col md:flex-row"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    whileHover={{
                        scale: 1.01,
                        borderColor: "rgba(0, 255, 194, 0.2)",
                        transition: { duration: 0.3 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >

                    {/* Left Content Section */}
                    <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center h-[644px]">
                        <h4 className="text-white text-3xl md:text-4xl font-bold mb-6">
                            Train Smarter, Anytime.
                        </h4>

                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Your all-in-one digital hub for drills, feedback, and
                            guided skill development.
                        </p>

                        {/* Feature List */}
                        <ul className="space-y-5 mb-10 text-gray-300">
                            {[
                                { icon: "📚", text: "Step-by-step video lessons from UEFA coaches." },
                                { icon: "⏱️", text: "Sessions that fit your schedule, train anytime." },
                                { icon: "⚽", text: "Build habits with daily training routines." },
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: 0.2 + (index * 0.1)
                                    }}
                                >
                                    <span className="text-[#00FFC2] text-xl">{item.icon}</span>
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>

                        {/* Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="bg-[#00FFC2] hover:bg-[#00E0AA] transition-colors text-black px-20 py-2 rounded-full hover:opacity-90 transition inline-block"
                                >
                                    Join Hub
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="border border-gray-500 text-white px-20 py-2 rounded-full hover:bg-gray-800 transition inline-block"
                                >
                                    Learn More
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Image Section */}
                    <div className="md:w-1/2 relative h-[644px] w-full md:h-auto">
                        <Image
                            src={imgHubLanding}
                            alt="Your Digital Training Ground"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
