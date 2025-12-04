"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import coach1 from "@/assets/coach/coach1.avif";
import coach2 from "@/assets/coach/coach2.avif";
import coach3 from "@/assets/coach/coach3.avif";
import coach4 from "@/assets/coach/coach4.avif";
import { twMerge } from "tailwind-merge";

const teamMembers = [
  { name: "Rhys Barker", role: "Football coach", image: coach1, col: 1 },
  { name: "Ben Eldridge", role: "Head of Education", image: coach2, col: 2 },
  { name: "David Shaw", role: "Football coach", image: coach3, col: 2 },
  { name: "Luke Perry", role: "Football coach", image: coach4, col: 1 },
];

export default function TeamSection() {
  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[#00FFC2] text-xl font-medium mb-4">Meet The Team</h2>
          <h3 className="text-white text-4xl md:text-5xl font-bold">
            Learn from Proven Football Experts
          </h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-10">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              className={`
    group relative overflow-hidden bg-[#00FFC2] 
    ${member.col === 1 ? "sm:col-span-2 lg:col-span-2 aspect-square" : "sm:col-span-4 lg:col-span-4 aspect-2"}
    ${i % 2 === 0 ? "clip-right-only text" : "clip-left-only"}
  `}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-center transition-all duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div
                className={twMerge(
                  "absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-5",
                  i % 2 !== 0 ? "text-right" : "text-left",
                )}
              >
                <h4 className="text-white text-lg font-bold">{member.name}</h4>
                <p className={twMerge("text-gray-200 text-sm")}>{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
