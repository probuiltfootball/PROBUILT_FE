"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import coach1 from "@/assets/coach/coach1.avif";
import Coach1 from "@/assets/figma/Ben_profile.png";
import Coach2 from "@/assets/figma/Rhys_profile.png";

export default function TeamSection() {
  return (
    <section className="mt-12 mb-16 mx-20 text-(--secondary)">
      {/* Header */}
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          Meet Your Future Coaches
        </h2>
        <h3 className="text-(--accent) text-xl leading-tight">
          Train with qualified coaches who know how to develop winning players.
        </h3>
      </motion.div>

      {/* Grid */}
      <div className="flex flex-row gap-8 justify-center">
        <motion.div
          className="flex flex-col justify-center items-center flex-1 max-w-101.75 gap-5"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image src={Coach1} alt="Coach 1" />
          <h2 className="text-4xl">Ben Eldridge</h2>
          <p className="text-xl text-(--accent) text-center">
            Oversees training education and supports players through structured
            development pathways.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-col justify-center items-center flex-1 max-w-101.75 gap-5"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image src={Coach2} alt="Coach 2" />
          <h2 className="text-4xl">Rhys Barker</h2>
          <p className="text-xl text-(--accent) text-center">
            Brings 25+ years of UEFA-qualified coaching experience across grassroots to
            professional levels.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
