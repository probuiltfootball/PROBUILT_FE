"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import edge_image from "@/assets/figma/edge_landing_page.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import star from "@/assets/figma/Social Media Icon Square/kid_star.png";
import sport_soccer from "@/assets/figma/Social Media Icon Square/sports_soccer.png";
import tactic from "@/assets/figma/Social Media Icon Square/tactic.png";
import alarm from "@/assets/figma/Social Media Icon Square/alarm.png";

const GuidedSession = () => {
  return (
    <motion.div className="my-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-medium mb-3">Guided Sessions for Every Position</h2>
        <h3 className="text-xl leading-tight text-(--turquoise)">
          Every session built around what your position demands.
        </h3>
      </motion.div>

      {/* Card */}
      <div className="flex flex-col md:flex-row gap-15 bg-(--card-bg) rounded-[30px] p-8 md:p-12 lg:p-20">
        <div>
          <Image
            src={edge_image}
            alt="Edge Landing 1"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xl leading-tight text-(--turquoise)">
            Example Session · Attacking Midfielder
          </h3>
          <h2 className="text-4xl">Positional Awareness</h2>
          <h3 className="text-xl leading-tight text-(--yellow) flex gap-2">
            50 PB Points
            <span>
              <Image src={star} alt="star" className="w-5 h-5 mr-2" />
            </span>
          </h3>
          <ul className="flex flex-col gap-5 mt-3">
            <li className="flex">
              <Image src={sport_soccer} alt="Technical drill" className="w-5 h-5 mr-2" />
              <span>Technical drill</span>
            </li>
            <li className="flex">
              <Image src={tactic} alt="Tactical breakdown" className="w-5 h-5 mr-2" />
              <span>Tactical breakdown</span>
            </li>
            <li className="flex">
              <Image src={alarm} alt="Completion time" className="w-5 h-5 mr-2" />
              <span>Completion time: 1 hour</span>
            </li>
          </ul>
          <motion.div
            className="flex flex-row md:gap-4 gap-2 mt-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/example-session">
                <Button variant="primary" size="lg" className="flex-1">
                  Start Example Session
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GuidedSession;
