"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteLogo from "@/assets/svg/site-logo.svg";

// Background gallery images
import img0 from "@/assets/football/horz0.jpg";
import img1 from "@/assets/football/horz1.jpg";
import img2 from "@/assets/football/horz2.avif";
import img3 from "@/assets/football/horz3.avif";
import img4 from "@/assets/football/horz4.avif";
import img5 from "@/assets/football/horz5.avif";
import img6 from "@/assets/football/horz6.avif";
import img7 from "@/assets/football/vert1.avif";
import img8 from "@/assets/football/vert2.avif";
import img9 from "@/assets/football/vert3.avif";
import img10 from "@/assets/football/vert4.avif";
import img11 from "@/assets/football/vert5.avif";

const images = [img0, img1, img2, img3, img4, img5];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pb-20">
      <motion.div className="HERO relative flex flex-col items-center justify-center w-full text-center px-4 min-h-[700px] h-[1020px] xl:h-[1440px] overflow-hidden rounded-b-3xl border-2 border-t-0 border-[#00FFC220] shadow-2xl">
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10 z-5" />

        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt="Football background"
            fill
            priority={i === 0}
            className={`
                        object-cover object-bottom
                        absolute inset-0
                        transition-opacity duration-1000
                        ${i === index ? "opacity-100" : "opacity-0"}
                    `}
          />
        ))}

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col mt-auto justify-center items-center mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
        >
          <div className="mb-8">
            <Image src={SiteLogo} alt="Probuilt Logo" width={80} height={80} />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Unlock Your <span className="text-[#00FFC2]">Football Potential.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            Unlock your potential with UEFA-licensed coaching — train with Edge or grow
            with the Academy.
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
    </section>
  );
}
