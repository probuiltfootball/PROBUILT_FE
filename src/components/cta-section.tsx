"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaSection() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="pb-20 px-6">
            <motion.div
                className="max-w-[1280px] bg-[#00000080] rounded-3xl py-12 mx-auto border border-[#00FFC220]"
                initial={{ y: 0 }}
                animate={{
                    y: scrollY > 2000 ? Math.min(scrollY * 0.05, 30) : 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
            >
                <motion.div
                    className="p-12 justify-center items-center text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.08 }}
                >
                    {/* Heading */}
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    >
                        Ready to Achieve <span className="text-[#00FFC2]">Your Goals?</span>
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    >
                        Stay Ahead of the Competition Train with UEFA-licensed coaches
                        and start building your edge today.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/edge"
                                className="inline-block px-12 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
                            >
                                Start Edge
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/hub"
                                className="inline-block px-12 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
                            >
                                Start Hub
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
