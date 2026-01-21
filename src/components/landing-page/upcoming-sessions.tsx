"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import session_image from "@/assets/figma/placeholder.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "./ui/button";
import Link from "next/link";

export default function UpcomingSessions() {
  return (
    <section className="mt-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          Ready to Start Your Development?
        </h2>
        <h3 className="text-(--turquoise) text-xl leading-tight">
          Compare structured training and coach-supported development.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-col md:flex-row items-center gap-15 bg-(--card-bg) rounded-[30px] md:p-21.25 p-8">
        <div>
          <Image
            src={session_image}
            alt="Session Image"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-7">
          <motion.div
            className="flex justify-center md:justify-start"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Button variant="tag" size="lg">
              Hub & Edge
            </Button>
          </motion.div>
          <h2 className="text-4xl">Structured training or coaching support.</h2>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Structured training programmes</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Coach Q&A and feedback</span>
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Weekly online mentoring (Edge)</span>
            </li>
          </ul>
          <motion.div
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/membership">
                <Button variant="primary" size="lg">
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
