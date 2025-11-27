"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";

// Testimonial data
const testimonials = [
    {
        rating: 5,
        text: "The sessions covered all my expectations and helped me feel like a more complete player.",
        name: "Jack Rodwell",
        role: "Professional Football Player",
        avatar: "/placeholder-avatar.jpg", // Replace with actual image path
    },
    {
        rating: 5,
        text: "The sessions covered all my expectations and helped me feel like a more complete player.",
        name: "Jack Rodwell",
        role: "Professional Football Player",
        avatar: "/placeholder-avatar.jpg",
    },
    {
        rating: 5,
        text: "The sessions covered all my expectations and helped me feel like a more complete player.",
        name: "Jack Rodwell",
        role: "Professional Football Player",
        avatar: "/placeholder-avatar.jpg",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="pb-20 px-6 ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="text-[#00FFC2] text-xl font-medium mb-4">
                        Player Stories
                    </h2>
                    <h3 className="text-white text-4xl md:text-5xl font-bold">
                        Players' Testimonials
                    </h3>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="bg-[#2E2E2E80] border border-[#00FFC270] rounded-2xl p-8 flex flex-col"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: index * 0.15
                            }}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 0 30px rgba(0, 255, 194, 0.3)",
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* Star Rating */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 text-xl" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-white text-base leading-relaxed mb-8 flex-grow">
                                {testimonial.text}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-full bg-[#00FFC2]/20 flex items-center justify-center flex-shrink-0">
                                    <FaUserTie className="text-[#00FFC2] text-4xl" />
                                </div>

                                {/* Name and Role */}
                                <div>
                                    <h4 className="text-white font-bold text-base">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
