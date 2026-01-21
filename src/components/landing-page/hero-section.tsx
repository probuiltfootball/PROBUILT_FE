"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import herobg from "@/assets/figma/Hero_image.png";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <motion.div className="relative flex justify-center text-center rounded-4xl mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 h-180">
      <Image
        src={herobg}
        alt="Football background"
        fill
        className="object-cover object-bottom rounded-4xl opacity-50"
      />

      {/* Content */}
      <motion.div
        className="relative flex flex-col justify-center items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.08 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-3"
        >
          Where Footballers Train Smarter
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mb-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          Join ProBuilt to track training, build habits, and grow inside a driven football
          community.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/lite">
              <Button variant="primary" size="lg">
                Start Free
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/membership">
              <Button variant="secondary" size="lg">
                Compare Plans
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
