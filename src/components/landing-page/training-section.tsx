"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import training_section from "@/assets/figma/Edge_dashboard/Edge_community.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrainingSection() {
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
          Train, Apply, & Improve.
        </h2>
        <h3 className="text-(--turquoise) text-xl leading-tight">
          A simple, repeatable development process.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-col md:flex-row gap-15 bg-(--card-bg) rounded-[30px] md:p-21.25 p-8">
        <div>
          <Image
            src={training_section}
            alt="Session Image"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-7">
          <h2 className="text-4xl">How ProBuilt Training Works</h2>
          <h3 className="text-(--turquoise) text-xl leading-tight">
            A simple process designed to improve your game.
          </h3>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Train with structured programmes</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Apply sessions on the pitch</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Track progress over time</span>
            </li>
          </ul>
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
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
        </div>
      </div>
    </section>
  );
}
