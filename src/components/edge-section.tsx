"use client";

import Image from "next/image";
import Link from "next/link";
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
        <h2 className="text-4xl font-medium mb-3">Edge: Individual Coaching Needs</h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          A personalised, UEFA-coach-built plan tailored to your position, strengths, and
          long-term ambition.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
        <div>
          <Image
            src={edge_image}
            alt="Edge Landing 1"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-7">
          <motion.img
            src={tag.src}
            alt="most popular tag"
            className="w-44.5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
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
              <Link href="/edge">
                <Button variant="primary" size="lg" className="flex-1">
                  Start Edge
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/learn-more">
                <Button variant="secondary" size="lg" className="flex-1">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
