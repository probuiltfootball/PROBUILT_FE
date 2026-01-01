"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import white_checkmark from "@/assets/figma/Social Media Icon Square/white_checkmark.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import orange_checkmark from "@/assets/figma/Social Media Icon Square/orange_checkmark.png";
import person_icon from "@/assets/figma/Social Media Icon Square/person.png";
import hub_icon from "@/assets/figma/Social Media Icon Square/sports_soccer.png";
import edge_icon from "@/assets/figma/Social Media Icon Square/rocket_launch.png";
import { Button } from "./ui/button";
import Link from "next/link";
import { hu } from "zod/locales";

export default function PathSelection() {
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
          Choose Your Own Path
        </h2>
        <h3 className="text-(--accent) text-xl leading-tight">
          Everyone starts free on Lite. Upgrade when you’re ready.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col justify-center items-start gap-2 bg-[#27272E] rounded-[20px] p-8 border-2 border-(--secondary)">
          <h2 className="flex gap-2 items-center text-4xl font-semibold">
            <span>
              <Image src={person_icon} alt="person" />
            </span>
            Hub Lite
          </h2>
          <p>Limited access.</p>
          <span>Free</span>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={white_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Player discussion threads
            </li>
            <li className="flex items-center">
              <Image src={white_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Progress sharing
            </li>
            <li className="flex items-center">
              <Image src={white_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              PB Points & streaks
            </li>
          </ul>
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div>
              <Link href="/lite">
                <Button variant="lite" size="lg">
                  Start Free
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="flex flex-col justify-center items-start gap-2 bg-[#27272E] rounded-[20px] p-8 border-2 border-(--accent)">
          <h2 className="flex gap-2 items-center text-4xl font-semibold">
            <span>
              <Image src={hub_icon} alt="hub icon" />
            </span>
            Hub
          </h2>
          <p>Structured digital training.</p>
          <span>£8,00/wk</span>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Full training library
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Multiple focus tracks
            </li>
            <li className="flex items-center">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Progress insights
            </li>
          </ul>
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div>
              <Link href="/membership">
                <Button variant="primary" size="lg">
                  Compare Plans
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="flex flex-col justify-center items-start gap-2 bg-[#27272E] rounded-[20px] p-8 border-2 border-[#FFD100]">
          <h2 className="flex gap-2 items-center text-4xl font-semibold">
            <span>
              <Image src={edge_icon} alt="edge icon" />
            </span>
            Edge
          </h2>
          <p>Best for progression.</p>
          <span>£15,00/wk</span>
          <ul className="space-y-5 flex flex-col">
            <li className="flex items-center">
              <Image src={orange_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Coach Q&A and feedback
            </li>
            <li className="flex items-center">
              <Image src={orange_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Live webinars
            </li>
            <li className="flex items-center">
              <Image src={orange_checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              Weekly online mentoring sessions
            </li>
          </ul>
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div>
              <Link href="/membership">
                <Button variant="tag" size="lg">
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
