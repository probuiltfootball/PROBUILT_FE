"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; import SiteLogo from "@/assets/figma/logo1.png";
import herobg from "@/assets/football/horz4.avif";

import { Button } from "./ui/button";

// const images = [img0, img1, img2, img3, img4, img5];

export default function HeroSection() {
  // const [index, setIndex] = useState(0);

  return (
    <motion.div className="relative flex justify-center text-center rounded-4xl mt-36 mb-16 mx-20 h-[720px]">
      <Image
        src={herobg}
        alt="Football background"
        fill
        className="object-cover object-bottom rounded-4xl"
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
          className="text-16 md:text-7xl font-bold text-white tracking-tight mb-3"
        >
          Refine Your Game With Precision
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mb-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          Elite coaching and digital training tools to develop smarter, faster
          footballers.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/membership" className="px-16 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors inline-block">
              View Plans
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/membership" className="px-16 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors inline-block">
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
