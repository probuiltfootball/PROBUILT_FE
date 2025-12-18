"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import session_image from "@/assets/figma/placeholder.png";
import tag from "@/assets/figma/Tags/probuilt_plans.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "./ui/button";
import { s } from "framer-motion/client";
import Link from "next/link";

export default function UpcomingSessions() {
  return (
    <section className="my-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          The Right Plan Gets You Further
        </h2>
        <h3 className="text-(--accent) text-xl leading-tight">
          Choose how you want to develop your football skills.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-col md:flex-row items-center gap-15 bg-[#27272E] rounded-[30px] p-21.25">
        <div>
          <Image
            src={session_image}
            alt="Session Image"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-7">
          <motion.img
            src={tag.src}
            alt="most popular tag"
            className="w-44.5"
            animate={{ scale: [1, 1.05, 1] }} // zoom in → zoom out → repeat
            transition={{
              duration: 1.6, // speed of the pulse
              repeat: Infinity, // loop forever
              ease: "easeInOut",
            }}
          />
          <h2 className="text-4xl">Compare in-person coaching and digital training.</h2>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>1:1 Coaching</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Match Insights</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Personalised Plan</span>
            </li>
          </ul>
          <motion.div
            className="flex flex-row sm:flex-col md:gap-4 gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/membership">
                <Button variant="primary" size="lg" className="flex-1">
                  Compare Plans
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/talk-to-caoch">
                <Button variant="secondary" size="lg" className="flex-1">
                  Talk to a Coach
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
