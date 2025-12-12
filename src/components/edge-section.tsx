"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import edge_image from "@/assets/figma/edge_landing_page.png";
import tag from "@/assets/figma/Tags/most_popular.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "./ui/button";

export default function EdgeSection() {
  return (
    <section className="my-16 mx-20 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          Edge: Train 1:1 With Elite Coaches
        </h2>
        <h3 className="text-(--accent) text-xl leading-tight">
          A personalised, UEFA-coach-built plan tailored to your position, strengths, and
          long-term ambition.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-[85px]">
        <div>
          <Image
            src={edge_image}
            alt="Edge Landing 1"
            className="rounded-xl object-fill"
          />
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          <motion.div
            className="bg-[#2E2E2E80] rounded-3xl border border-[#00FFC270] overflow-hidden flex flex-col h-[640px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(0, 255, 194, 0.3)",
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="p-8 md:p-12" style={{ height: "294px" }}>
              <h4 className="text-white text-3xl font-bold mb-4">
                Expert Coaching, Real Results
              </h4>
              <p className="text-gray-400 text-lg mb-8 line-clamp-3 min-h-18 leading-6">
                Train with UEFA-qualified coaches who turn the game into clear, actionable
                steps that accelerate your development.
              </p>
              <Link
                href="/membership"
                className="text-[#00FFC2] text-lg font-medium flex items-center gap-2 hover:gap-3 transition-all"
              >
                View Plans
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
            <div className="relative flex-1 mt-10 sm:mt-0">
              <Image src={imgEdgeLanding1} alt="Stadium" fill className="object-cover" />
            </div>
          </motion.div>

        <div className="flex flex-col gap-7">
          <motion.img
            src={tag.src}
            alt="most popular tag"
            className="w-[178px]"
            animate={{ scale: [1, 1.05, 1] }} // zoom in → zoom out → repeat
            transition={{
              duration: 1.6, // speed of the pulse
              repeat: Infinity, // loop forever
              ease: "easeInOut",
            }}
          />
          <h2 className="text-4xl">
            Train Smarter With Expert Coaching & Match Insights
          </h2>
          <ul className="space-y-5 grid grid-cols-2">
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>UEFA-Level Coaching</span>
            </li>
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Match Analysis</span>
            </li>
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Personal Plans</span>
            </li>
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Fits Your Schedule</span>
            </li>
          </ul>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="primary" size="lg" className="flex-1">
                Start Edge
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" size="lg" className="flex-1">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
